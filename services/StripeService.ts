import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe public key
const productkey = 'pk_live_51RYoWED1jXtJkztdnFrtkogwUk0yECGaJXYZNp45GuRajasaX2sp7BpahImMgDmvmDKbgrm8OKjEAIBEOLFr5VLj005d0UTRi1';
const stripePromise = loadStripe(productkey);

// Product IDs for each plan from your Stripe dashboard
export const STRIPE_PRODUCT_IDS = {
  basic: 'price_1RYq5BD1jXtJkztdbn1KdoFZ', // Replace with your actual price ID for Basic plan
  pro: 'price_1RYqHhD1jXtJkztdfm72Cdnr',     // Replace with your actual price ID for Pro plan
  premium: 'price_1RYqIQD1jXtJkztd3xITcOgS' // Replace with your actual price ID for Premium plan
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
