import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import Stripe from 'stripe'

// Lazy initialization to avoid build-time errors
function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2026-01-28.clover',
    })
}

export async function POST() {
    try {
        const supabase = await createClient()
        const supabaseAdmin = createAdminClient()

        // 1. Get authenticated user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        // 2. Get teacher record
        const { data: teacher } = await supabase
            .from('teachers')
            .select('id, email, stripe_customer_id')
            .eq('id', user.id)
            .single()

        if (!teacher) {
            return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
        }

        const stripe = getStripe()

        // 3. Create or retrieve Stripe customer
        let customerId = teacher.stripe_customer_id

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: teacher.email,
                metadata: {
                    teacher_id: teacher.id
                }
            })
            customerId = customer.id

            // Save customer ID to database
            await supabaseAdmin
                .from('teachers')
                .update({ stripe_customer_id: customerId })
                .eq('id', teacher.id)
        }

        // 4. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_STUDIO_PLAN_PRICE_ID!,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/studio/dashboard?upgrade=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/studio/dashboard?upgrade=cancelled`,
            metadata: {
                teacher_id: teacher.id
            }
        })

        return NextResponse.json({ url: session.url })
    } catch (error: unknown) {
        console.error('Checkout error:', error)
        const message = error instanceof Error ? error.message : 'Failed to create checkout session'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
