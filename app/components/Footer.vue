<template>
  <footer class="site-footer">
    <div class="footer-main">
      <div class="footer-content">
        <section class="contact-panel" aria-label="Contact information">
          <a
            class="contact-row"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=alhayat.medical@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="contact-text">alhayat.medical@gmail.com</span>
            <span class="icon-badge" aria-hidden="true">
              <Mail />
            </span>
          </a>

          <a
            class="contact-row"
            href="https://www.google.com/maps/search/?api=1&query=Palestine%2C%20Gaza%2C%20Al-Jala%27a%20St."
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="contact-text">فلسطين ، غزة ، شارع الجلاء</span>
            <span class="icon-badge" aria-hidden="true">
              <MapPin />
            </span>
          </a>

          <a class="contact-row" href="tel:+970590000000">
            <span class="contact-text">+970590000000</span>
            <span class="icon-badge" aria-hidden="true">
              <Phone />
            </span>
          </a>
        </section>

        <div class="footer-divider" aria-hidden="true"></div>

        <section class="social-panel" dir="rtl" aria-label="Social links">
          <h2>تواصل معنا</h2>

          <div class="social-links">
            <a  class="social-link" 
                href="whatsapp://send?phone=970590000000" 
                aria-label="WhatsApp">
              <WhatsAppIcon />
            </a>

            <a class="social-link" href="https://www.linkedin.com/" aria-label="LinkedIn" target="_blank">
              <LinkedinIcon />
            </a>

            <a class="social-link" href="https://www.instagram.com/" aria-label="Instagram" target="_blank">
              <InstagramIcon />
            </a>

            <a class="social-link" href="https://www.facebook.com/" aria-label="Facebook" target="_blank">
              <FacebookIcon />
            </a>
            
            <a class="social-link social-link-x" href="https://x.com/" aria-label="X" target="_blank">
              <XIcon />
            </a>
          </div>
        </section>
      </div>
    </div>

    <div class="footer-bottom">
      <strong>مجمع الحياة الطبي</strong>
      <p>© 2026 الجامعة الإسلامية بغزة - قسم هندسة الحاسوب -  مشروع هندسة البرمجيات - مجمع الحياة الطبي</p>
    </div>
  </footer>
</template>

<script setup>
  import { Mail, Phone, MapPin } from '@lucide/vue';
  import WhatsAppIcon from './icons/WhatsAppIcon.vue';
  import LinkedinIcon from './icons/LinkedinIcon.vue';
  import InstagramIcon from './icons/InstagramIcon.vue'; 
  import FacebookIcon from './icons/FacebookIcon.vue';
  import XIcon from './icons/XIcon.vue';
</script>

<style scoped>
.site-footer {
  width: 100%;
  margin-top: 0;
  color: #f7fbff;
  overflow: hidden;
}

.footer-main {
  position: relative;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.12) 0 12%, transparent 12.3%),
    radial-gradient(circle at top right, transparent 0 14%, rgba(255, 255, 255, 0.12) 14.2% 14.7%, transparent 15%),
    linear-gradient(180deg, #4696ff 0%, #398cff 100%);
}

.footer-content {
  width: min(1420px, calc(100% - 80px));
  min-height: 260px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2px 1fr;
  align-items: center;
  gap: 42px;
}

.contact-panel,
.social-panel {
  display: flex;
  flex-direction: column;
}

.contact-panel {
   margin-right: 20%;
  align-items: flex-end;
  gap: 12px;
}

.contact-row {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  color: inherit;
  text-decoration: none;
}

.contact-text {
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0;
  text-align: right;
}

.contact-text:hover {
    transform: translateY(-2px);

}
.icon-badge,
.social-link {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  background: rgba(255, 255, 255, 0.14);
  transition: transform 0.25s ease, background-color 0.25s ease;
}

.icon-badge svg,
.social-link svg {
  width: 31px;
  height: 31px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.contact-row:hover .icon-badge,
.social-link:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: translateY(-2px);
}

.footer-divider {
  width: 2px;
  height: 188px;
  justify-self: center;
  background: rgba(255, 255, 255, 0.82);
  border-radius: 999px;
}

.social-panel {
  align-items: center;
  gap: 28px;
}

.social-panel h2 {
  margin: 0;
  font-size: 25px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0;
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.social-link {
  color: inherit;
  text-decoration: none;
}

.social-link svg .filled-dot,
.social-link svg rect,
.social-link svg circle {
  fill: none;
}

.social-link svg .filled-dot {
  fill: currentColor;
  stroke: none;
}

.social-link:nth-child(4) svg path {
  fill: currentColor;
  stroke: none;
}

.social-link-x span {
  font-size: 34px;
  line-height: 1;
  font-weight: 300;
}

.footer-bottom {
  min-height: 86px;
  padding: 14px 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
  background: linear-gradient(180deg, #2476de 0%, #1f70da 100%);
}

.footer-bottom strong {
  font-size: 24px;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: 0;
}

.footer-bottom p {
  margin: 0;
  font-size: 16px;
  line-height: 1.45;
  letter-spacing: 0;
}

@media (max-width: 1030px) {
  .footer-content {
    width: min(100%, calc(100% - 40px));
    min-height: auto;
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 36px 0;
  }

  .contact-panel {
    margin-right: 0;
    align-items: center;
  }

  .footer-divider {
    width: min(100%, 560px);
    height: 2px;
  }

  .social-panel {
    gap: 22px;
  }
}

@media (max-width: 600px) {
  .footer-content {
    width: calc(100% - 28px);
    gap: 24px;
    padding: 28px 0;
  }

  .contact-panel {
    gap: 12px;
  }

  .contact-row {
    width: 100%;
    justify-content: space-between;
    gap: 14px;
  }

  .contact-text {
    font-size: 18px;
    text-align: left;
    overflow-wrap: anywhere;
  }

  .icon-badge,
  .social-link {
    width: 52px;
    height: 52px;
  }

  .icon-badge svg,
  .social-link svg {
    width: 28px;
    height: 28px;
  }

  .social-panel h2 {
    font-size: 22px;
  }

  .social-links {
    gap: 14px;
  }

  .social-link-x span {
    font-size: 30px;
  }

  .footer-bottom strong {
    font-size: 22px;
  }

  .footer-bottom p {
    font-size: 16px;
  }
}
</style>
