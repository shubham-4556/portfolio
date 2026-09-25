import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  // Testimonial profile photos. public_read so approved testimonials can load
  // images directly from the bucket; the same credential that backs the
  // database backs storage, and both branch together.
  buckets: {
    "testimonial-photos": { access: "public_read" },
  },
});