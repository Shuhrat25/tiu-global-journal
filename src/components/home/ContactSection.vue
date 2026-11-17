<script setup>
import ContactForm from './ContactForm.vue'
import PollCard from './PollCard.vue'
</script>

<template>
  <section id="contact" class="section" aria-labelledby="contact-title">
    <div class="container contact">
      <ContactForm />
      <PollCard />
    </div>
  </section>
</template>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: minmax(0, 992fr) minmax(0, 484fr);
  gap: 24px;
  align-items: stretch;
}

@media (max-width: 1199.98px) {
  .contact {
    grid-template-columns: 1fr;
  }
}

#contact {
  scroll-margin-top: calc(var(--header-h) + 16px);
}
</style>
