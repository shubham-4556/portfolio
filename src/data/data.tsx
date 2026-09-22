import {AcademicCapIcon, ArrowDownTrayIcon, MapIcon} from '@heroicons/react/24/outline';

import GithubIcon from '../components/Icon/GithubIcon';
import InstagramIcon from '../components/Icon/InstagramIcon';
import LinkedInIcon from '../components/Icon/LinkedInIcon';
import heroImage from '../images/header-background.webp';
import porfolioImage1 from '../images/portfolio/portfolio-1.jpg';
import profilepic from '../images/profilepic.jpg';
import testimonialImage from '../images/testimonial.webp';
import {
  About,
  ContactSection,
  ContactType,
  Hero,
  HomepageMeta,
  PortfolioItem,
  SkillGroup,
  Social,
  TestimonialSection,
  TimelineItem,
} from './dataDef';

/**
 * Page meta data
 */
export const homePageMeta: HomepageMeta = {
  title: 'Shubham Deo | Full Stack Web Developer',
  description:
    'Full Stack Web Developer skilled in TypeScript, React.js, Next.js, Node.js, Express.js, PostgreSQL, Tailwind CSS, AI Agents, and MCP.',
};

export const SectionId = {
  Hero: 'hero',
  About: 'about',
  Contact: 'contact',
  Portfolio: 'portfolio',
  Resume: 'resume',
  Skills: 'skills',
  Stats: 'stats',
  Testimonials: 'testimonials',
} as const;

export type SectionId = (typeof SectionId)[keyof typeof SectionId];

/**
 * Hero section
 */
export const heroData: Hero = {
  imageSrc: heroImage,
  name: `I'm Shubham Deo`,
  description: (
    <>
      <p className="prose-sm text-stone-200 sm:prose-base lg:prose-lg">
        I'm an India Based <strong className="text-stone-100">Full Stack Web Developer</strong>
      </p>

      <p className="prose-sm text-stone-200 sm:prose-base lg:prose-lg">
        I build responsive, scalable, and user-friendly web applications using modern technologies such as TypeScript,
        React.js, Next.js, Node.js, Express.js, PostgreSQL, and Tailwind CSS.
      </p>
    </>
  ),
  actions: [
    {
      href: '/assets/resume.pdf',
      text: 'Resume',
      primary: true,
      Icon: ArrowDownTrayIcon,
    },
    {
      href: `#${SectionId.Contact}`,
      text: 'Contact',
      primary: false,
    },
  ],
};

/**
 * About section
 */
export const aboutData: About = {
  profileImageSrc: profilepic,

  description: `I'm a Full Stack Web Developer focused on building responsive,
  scalable, and user-friendly web applications. I work across the full
  development lifecycle and enjoy writing clean, maintainable code while
  developing efficient end-to-end web solutions.`,

  aboutItems: [
    {
      label: 'Location',
      text: 'Deoghar, India',
      Icon: MapIcon,
    },
    {
      label: 'Study',
      text: 'Indra Gandhi National Open University',
      Icon: AcademicCapIcon,
    },
  ],
};

/**
 * Skills section
 */
export const skills: SkillGroup[] = [
  {
    name: 'Frontend Development',
    skills: [{name: 'TypeScript'}, {name: 'JavaScript'}, {name: 'React.js'}, {name: 'Next.js'}, {name: 'Tailwind CSS'}],
  },

  {
    name: 'Backend Development',
    skills: [{name: 'Node.js'}, {name: 'Express.js'}, {name: 'REST APIs'}],
  },

  {
    name: 'Database & Authentication',
    skills: [{name: 'PostgreSQL'}, {name: 'SQL'}, {name: 'JWT Authentication'}],
  },

  {
    name: 'AI & Development Tools',
    skills: [
      {name: 'LLM API Integration'},
      {name: 'MCP (Model Context Protocol)'},
      {name: 'AI Agents & Tool Calling'},
      {name: 'Git & GitHub'},
    ],
  },
];

/**
 * Portfolio section
 */
export const portfolioItems: PortfolioItem[] = [
  {
    title: 'AI Customer Support Agent with MCP',
    description:
      'Built an AI-powered customer support platform using Next.js, React, TypeScript, Node.js, Express, PostgreSQL, and JWT authentication. Integrated an LLM-powered agent with MCP tools to retrieve customer and order information and automate support-ticket workflows through natural-language interactions.',
    url: '',
    image: porfolioImage1,
  },
];

/**
 * Resume section
 */
export const education: TimelineItem[] = [
  {
    date: '2021 - 2024',
    location: 'Indra Gandhi National Open University',
    title: 'Bachelor of Arts (English)',
    content: <p>Bachelor of Arts in English from Indra Gandhi National Open University.</p>,
  },
];

export const experience: TimelineItem[] = [];

/**
 * Testimonial section
 *
 * No testimonials are currently listed in the resume.
 */
export const testimonial: TestimonialSection = {
  imageSrc: testimonialImage,
  testimonials: [],
};

/**
 * Contact section
 */
export const contact: ContactSection = {
  headerText: 'Get in touch.',
  description: 'Feel free to reach out for professional opportunities, collaborations, or web development projects.',

  items: [
    {
      type: ContactType.Email,
      text: 'shubhamdeo728@gmail.com',
      href: 'mailto:shubhamdeo728@gmail.com',
    },
    {
      type: ContactType.Location,
      text: 'Deoghar, India',
      href: 'https://www.google.com/maps/search/?api=1&query=Deoghar%2C%20India',
    },
  ],
};

/**
 * Social items
 *
 * Add your social profile URLs here
 */
export const socialLinks: Social[] = [
  {
    label: 'GitHub',
    Icon: GithubIcon,
    href: 'https://github.com/shubhamdeo',
  },
  {
    label: 'LinkedIn',
    Icon: LinkedInIcon,
    href: 'https://www.linkedin.com/in/shubham-kumar-deo-2a923a287?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  },
  {
    label: 'Instagram',
    Icon: InstagramIcon,
    href: 'https://www.instagram.com/subhamm__05?utm_source=qr&stkn=cXJxaW4xcDR1ZzMw',
  },
];
