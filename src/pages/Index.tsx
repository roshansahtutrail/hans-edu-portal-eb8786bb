import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Courses } from "@/components/Courses";
import { Faculty } from "@/components/Faculty";
import { FounderSection } from "@/components/FounderSection";
import { NewsNotices } from "@/components/NewsNotices";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { NoticePopup } from "@/components/NoticePopup";
import { LogoLoader } from "@/components/LogoLoader";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all essential data in parallel
        await Promise.all([
          supabase.from("courses").select("id").limit(1),
          supabase.from("faculty").select("id").limit(1),
          supabase.from("founder_message").select("id").limit(1),
          supabase.from("notices").select("id").limit(1),
        ]);
      } catch (error) {
        console.error("Error preloading data:", error);
      } finally {
        // Add a minimum delay for smooth UX
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <LogoLoader />;
  }

  return (
    <>
      <Helmet>
        <title>Hans Educational Institute | Professional Training & Career Courses</title>
        <meta
          name="description"
          content="Join Hans Educational Institute for industry-ready courses in Web Development, Data Science, Digital Marketing & more. Expert faculty, 95% placement rate."
        />
      </Helmet>
      <div className="min-h-screen bg-background animate-fade-in">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Courses />
          <Faculty />
          <FounderSection />
          <NewsNotices />
          <Contact />
        </main>
        <Footer />
        <NoticePopup />
      </div>
    </>
  );
};

export default Index;
