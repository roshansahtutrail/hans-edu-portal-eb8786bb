import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Courses } from "@/components/Courses";
import { Faculty } from "@/components/Faculty";
import { NewsNotices } from "@/components/NewsNotices";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { NoticePopup } from "@/components/NoticePopup";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Hans Educational Institute | Professional Training & Career Courses</title>
        <meta
          name="description"
          content="Join Hans Educational Institute for industry-ready courses in Web Development, Data Science, Digital Marketing & more. Expert faculty, 95% placement rate."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Courses />
          <Faculty />
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