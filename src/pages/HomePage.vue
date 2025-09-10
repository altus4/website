<template>
  <div>
    <HeroSection />
    <section id="features">
      <FeaturesSection />
    </section>
    <section id="architecture">
      <TechSpecsSection />
    </section>
    <section id="status">
      <ProjectStatusSection />
    </section>
    <CallToActionSection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue';
import FeaturesSection from '@/components/FeaturesSection.vue';
import TechSpecsSection from '@/components/TechSpecsSection.vue';
import ProjectStatusSection from '@/components/ProjectStatusSection.vue';
import CallToActionSection from '@/components/CallToActionSection.vue';
</script>
