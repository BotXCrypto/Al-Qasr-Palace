import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReservationEmailRequest {
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalPrice: number;
  reservationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      guestName, 
      guestEmail, 
      roomName, 
      checkIn, 
      checkOut, 
      adults, 
      children, 
      totalPrice,
      reservationId 
    }: ReservationEmailRequest = await req.json();

    console.log("Sending confirmation email to:", guestEmail);

    const emailResponse = await resend.emails.send({
      from: "Al Qasr Hotel <onboarding@resend.dev>",
      to: [guestEmail],
      subject: "Your Reservation at Al Qasr Hotel is Confirmed!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reservation Confirmation</title>
        </head>
        <body style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #FAF9F7; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #1A1F16 0%, #2A2F26 100%); padding: 40px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #C9A962; margin: 0; font-size: 32px; font-weight: normal;">Al Qasr</h1>
            <p style="color: #FFFFF5; margin: 8px 0 0; font-size: 14px; letter-spacing: 2px;">LUXURY HOTEL & SPA</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h2 style="color: #1A1F16; margin: 0 0 24px; font-weight: normal;">Dear ${guestName},</h2>
            
            <p style="color: #4A4A4A; line-height: 1.8;">
              Thank you for choosing Al Qasr Hotel. We are delighted to confirm your reservation.
            </p>
            
            <div style="background: #FAF9F7; padding: 24px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #C9A962;">
              <h3 style="color: #1A1F16; margin: 0 0 16px; font-size: 18px;">Reservation Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6B6B6B;">Confirmation #</td>
                  <td style="padding: 8px 0; color: #1A1F16; text-align: right; font-weight: bold;">${reservationId.slice(0, 8).toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B6B6B;">Accommodation</td>
                  <td style="padding: 8px 0; color: #1A1F16; text-align: right;">${roomName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B6B6B;">Check-in</td>
                  <td style="padding: 8px 0; color: #1A1F16; text-align: right;">${checkIn}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B6B6B;">Check-out</td>
                  <td style="padding: 8px 0; color: #1A1F16; text-align: right;">${checkOut}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6B6B6B;">Guests</td>
                  <td style="padding: 8px 0; color: #1A1F16; text-align: right;">${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}</td>
                </tr>
                <tr style="border-top: 1px solid #E0E0E0;">
                  <td style="padding: 16px 0 8px; color: #1A1F16; font-weight: bold;">Estimated Total</td>
                  <td style="padding: 16px 0 8px; color: #C9A962; text-align: right; font-size: 20px; font-weight: bold;">$${totalPrice.toLocaleString()}</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #4A4A4A; line-height: 1.8;">
              Our concierge team will reach out to you shortly to finalize any special arrangements for your stay.
            </p>
            
            <p style="color: #4A4A4A; line-height: 1.8; margin-top: 24px;">
              We look forward to welcoming you to Al Qasr.
            </p>
            
            <p style="color: #1A1F16; margin-top: 32px;">
              Warm regards,<br>
              <strong>The Al Qasr Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 24px; color: #6B6B6B; font-size: 12px;">
            <p>Al Qasr Hotel & Spa</p>
            <p>The Palm Jumeirah, Dubai, UAE</p>
            <p>+971 4 999 8888 | reservations@alqasr.com</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
