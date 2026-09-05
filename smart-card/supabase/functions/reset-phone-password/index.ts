import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const {
      accessToken,
      phone,
      newPassword,
    } = await req.json();

    // -----------------------------
    // 1. Validate input
    // -----------------------------

    if (!accessToken || !phone || !newPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Password must be at least 6 characters.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // -----------------------------
    // 2. Environment variables
    // -----------------------------

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY"
    );
    const msg91AuthKey = Deno.env.get("MSG91_AUTH_KEY");

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      !msg91AuthKey
    ) {
      throw new Error(
        "Required server configuration is missing."
      );
    }

    // -----------------------------
    // 3. Verify MSG91 access token
    // -----------------------------

    const msg91Response = await fetch(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      {
        method: "POST",
        headers: {
          authkey: msg91AuthKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "access-token": accessToken,
        }),
      }
    );

    const msg91Data = await msg91Response.json();

    console.log(
      "MSG91 verification status:",
      msg91Response.status
    );

    if (!msg91Response.ok) {
      console.error(
        "MSG91 verification failed:",
        msg91Data
      );

      return new Response(
        JSON.stringify({
          success: false,
          error: "Phone verification failed.",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // -----------------------------
    // 4. Normalize phone
    // -----------------------------

    const normalizedPhone = phone.startsWith("+")
      ? phone
      : `+${phone}`;

    // -----------------------------
    // 5. Supabase admin client
    // -----------------------------

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey
    );

    // -----------------------------
    // 6. Find user through profiles
    // -----------------------------

    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, phone")
        .eq("phone", normalizedPhone)
        .maybeSingle();

    if (profileError) {
      console.error(
        "PROFILE LOOKUP ERROR:",
        profileError
      );

      return new Response(
        JSON.stringify({
          success: false,
          error: "Unable to find account.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!profile) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "No account found with this mobile number.",
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // -----------------------------
    // 7. Update password
    // -----------------------------

    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(
        profile.id,
        {
          password: newPassword,
        }
      );

    if (updateError) {
      console.error(
        "PASSWORD UPDATE ERROR:",
        updateError
      );

      return new Response(
        JSON.stringify({
          success: false,
          error: "Unable to update password.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // -----------------------------
    // 8. Success
    // -----------------------------

    return new Response(
      JSON.stringify({
        success: true,
        message: "Password updated successfully.",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "RESET PHONE PASSWORD ERROR:",
      error
    );

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});