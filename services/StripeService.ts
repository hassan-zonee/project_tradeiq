import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe public key from environment variable
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// Product IDs for each plan from your Stripe dashboard
export const STRIPE_PRODUCT_IDS = {
  basic: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || '', // Basic plan price ID
  pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',     // Pro plan price ID
  premium: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || '' // Premium plan price ID
};

export const createCheckoutSession = async (priceId: string, userId: string) => {
  try {
    // Call your API endpoint to create a checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
      }),
    });

    const { sessionId } = await response.json();
    
    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Failed to load Stripe');
    
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const checkSubscriptionStatus = async (userId: string): Promise<{ isSubscribed: boolean, plan?: string }> => {
  try {
    const response = await fetch(`/api/check-subscription?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check subscription status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return { isSubscribed: false };
  }
};
