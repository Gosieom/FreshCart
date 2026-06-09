import Image from "next/image";
import Link from "next/link";
import "./page.css";

export default function GetStartedPage() {
  return (
    <main className="get_started_container">
      <section className="get_started_card">
        <div className="logo_area">
          <Image
            src="/freshcart-logo.png"
            alt="FreshCart Logo"
            width={180}
            height={120}
            className="get_started_logo"
            priority
          />
        </div>

        <p>
          Smart online grocery shopping system with login and registration
          module.
        </p>

        <div className="get_started_actions">
          {/* Corrected links */}
          <Link href="/user/login" className="login_btn">
            Login
          </Link>

          <Link href="/user/register" className="register_btn">
            Register
          </Link>
        </div>
      </section>
    </main>
  );
}