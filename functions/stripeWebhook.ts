import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')
    );

    console.log('Webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userEmail = session.metadata.user_email;
      const tier = session.metadata.tier;

      console.log('Subscription created for:', userEmail, 'tier:', tier);

      // Update user subscription
      const subs = await base44.asServiceRole.entities.UserSubscription.list();
      const userSub = subs.find(s => s.created_by === userEmail);

      if (userSub) {
        await base44.asServiceRole.entities.UserSubscription.update(userSub.id, {
          tier: tier,
          patterns_used_today: 0,
          last_pattern_date: new Date().toISOString().split('T')[0]
        });
        console.log('Updated subscription for:', userEmail);
      } else {
        await base44.asServiceRole.entities.UserSubscription.create({
          tier: tier,
          patterns_used_today: 0,
          total_patterns_created: 0,
          has_used_free_pattern: false,
          superbowl_entry_submitted: false
        });
        console.log('Created subscription for:', userEmail);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const customerEmail = subscription.metadata?.user_email;

      if (customerEmail) {
        console.log('Subscription canceled for:', customerEmail);
        const subs = await base44.asServiceRole.entities.UserSubscription.list();
        const userSub = subs.find(s => s.created_by === customerEmail);

        if (userSub) {
          await base44.asServiceRole.entities.UserSubscription.update(userSub.id, {
            tier: 'free',
            patterns_used_today: 0
          });
          console.log('Downgraded to free tier:', customerEmail);
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
});