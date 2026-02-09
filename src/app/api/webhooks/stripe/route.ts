import { NextRequest, NextResponse } from 'next/server'
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

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
        return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    const stripe = getStripe()
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Webhook verification failed'
        console.error('Webhook signature verification failed:', message)
        return NextResponse.json({ error: message }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient()

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const teacherId = session.metadata?.teacher_id

                if (teacherId) {
                    // Upgrade teacher to Studio Plan
                    await supabaseAdmin
                        .from('teachers')
                        .update({
                            stripe_subscription_id: session.subscription as string,
                            subscription_status: 'active',
                            subscription_tier: 'studio',
                            max_students: 999 // Unlimited
                        })
                        .eq('id', teacherId)

                }
                break
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription

                // Find teacher by subscription ID
                const { data: teacher } = await supabaseAdmin
                    .from('teachers')
                    .select('id')
                    .eq('stripe_subscription_id', subscription.id)
                    .single()

                if (teacher) {
                    // Downgrade to free tier
                    await supabaseAdmin
                        .from('teachers')
                        .update({
                            subscription_status: 'free',
                            subscription_tier: 'free',
                            max_students: 3,
                            stripe_subscription_id: null
                        })
                        .eq('id', teacher.id)

                }
                break
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription

                // Handle subscription status changes (e.g., past_due, canceled)
                const { data: teacher } = await supabaseAdmin
                    .from('teachers')
                    .select('id')
                    .eq('stripe_subscription_id', subscription.id)
                    .single()

                if (teacher) {
                    const status = subscription.status === 'active' ? 'active' : subscription.status

                    await supabaseAdmin
                        .from('teachers')
                        .update({ subscription_status: status })
                        .eq('id', teacher.id)
                }
                break
            }

            default:
                // Unhandled event types are intentionally ignored
        }

        return NextResponse.json({ received: true })
    } catch (error: unknown) {
        console.error('Webhook handler error:', error)
        const message = error instanceof Error ? error.message : 'Webhook handler failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
