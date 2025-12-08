import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Create test admin user
    const testEmail = "admin@test.com";
    const testPassword = "admin123";

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === testEmail);

    if (existingUser) {
      // Ensure they have super_admin role
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", existingUser.id)
        .single();

      if (!existingRole) {
        await supabase.from("user_roles").insert({
          user_id: existingUser.id,
          role: "super_admin"
        });
      }

      return new Response(
        JSON.stringify({ 
          message: "Admin user already exists",
          email: testEmail,
          password: testPassword
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: "Test Admin" }
    });

    if (createError) {
      throw createError;
    }

    // Assign super_admin role
    await supabase.from("user_roles").insert({
      user_id: newUser.user.id,
      role: "super_admin"
    });

    return new Response(
      JSON.stringify({ 
        message: "Admin user created successfully",
        email: testEmail,
        password: testPassword
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});