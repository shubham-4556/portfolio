import {FC, memo} from 'react';

import {socialLinks} from '../data/data';

type SocialsProps = {
  variant?: 'default' | 'chips';
};

const Socials: FC<SocialsProps> = memo(({variant = 'default'}) => {
  if (variant === 'chips') {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-3">
        {socialLinks.map(({label, Icon, href}) => (
          <li key={label}>
            <a
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-300 shadow-lg shadow-black/30 backdrop-blur-md transition-all duration-300 hover:border-orange-400/50 hover:text-orange-400 hover:shadow-[0_0_18px_rgba(249,115,22,0.28)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 lg:h-auto lg:w-auto lg:border-0 lg:bg-transparent lg:p-1.5 lg:shadow-none lg:backdrop-blur-none lg:hover:bg-transparent lg:hover:shadow-none"
              href={href}
              rel="noopener noreferrer"
              target="_blank">
              <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      {socialLinks.map(({label, Icon, href}) => (
        <a
          aria-label={label}
          className="-m-1.5 rounded-md p-1.5 transition-all duration-300 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500  sm:-m-3 sm:p-3"
          href={href}
          key={label}
          rel="noopener noreferrer"
          target="_blank">
          <Icon className="h-5 w-5 align-baseline sm:h-6 sm:w-6" />
        </a>
      ))}
    </>
  );
});

Socials.displayName = 'Socials';
export default Socials;
