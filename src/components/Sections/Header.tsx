import {Dialog, Transition} from '@headlessui/react';
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {motion} from 'framer-motion';
import Link from 'next/link';
import {FC, Fragment, memo, useCallback, useEffect, useMemo, useState} from 'react';

import {SectionId} from '../../data/data';
import {useNavObserver} from '../../hooks/useNavObserver';

export const headerID = 'headerNav';

const navLabels: Record<string, string> = {
  [SectionId.Portfolio]: 'Project',
};

const ACTIVE_INDICATOR = 'headerActivePill';

const floatEase = [0.175, 0.885, 0.32, 1.275] as [number, number, number, number];

const Header: FC = memo(() => {
  const [currentSection, setCurrentSection] = useState<SectionId | null>(null);
  const navSections = useMemo(
    () => [SectionId.About, SectionId.Resume, SectionId.Portfolio, SectionId.Testimonials, SectionId.Contact],
    [],
  );

  const intersectionHandler = useCallback((section: SectionId | null) => {
    section && setCurrentSection(section);
  }, []);

  useNavObserver(navSections.map(section => `#${section}`).join(','), intersectionHandler);

  return (
    <>
      <MobileNav currentSection={currentSection} navSections={navSections} />
      <DesktopNav currentSection={currentSection} navSections={navSections} />
    </>
  );
});

const DesktopNav: FC<{navSections: SectionId[]; currentSection: SectionId | null}> = memo(
  ({navSections, currentSection}) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 24);
      onScroll();
      window.addEventListener('scroll', onScroll, {passive: true});
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden justify-center px-4 pt-3 lg:flex lg:pt-4"
        id={headerID}>
        <nav
          className={classNames(
            'pointer-events-auto flex items-center gap-1 rounded-full border bg-black/55 px-2 py-2 shadow-lg shadow-black/40 backdrop-blur-xl transition-all duration-500',
            scrolled ? 'border-white/15 bg-[#050505]/85 py-1.5 backdrop-blur-2xl' : 'border-white/10 py-2',
          )}>
          {navSections.map(section => (
            <NavItem
              activeLayoutId={ACTIVE_INDICATOR}
              current={section === currentSection}
              key={section}
              section={section}
            />
          ))}
        </nav>
      </header>
    );
  },
);

const MobileNav: FC<{navSections: SectionId[]; currentSection: SectionId | null}> = memo(
  ({navSections, currentSection}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleOpen = useCallback(() => {
      setIsOpen(open => !open);
    }, []);

    useEffect(() => {
      if (!isOpen) return;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    return (
      <>
        <button
          aria-controls="mobile-nav-panel"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          className="fixed right-[18px] top-[18px] z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white shadow-lg shadow-black/40 backdrop-blur-xl transition-all duration-300 hover:border-orange-400/40 hover:text-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] active:scale-95 lg:hidden"
          onClick={toggleOpen}>
          {isOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          <span className="sr-only">{isOpen ? 'Close navigation menu' : 'Open navigation menu'}</span>
        </button>

        <Transition.Root as={Fragment} show={isOpen}>
          <Dialog as="div" className="fixed inset-0 z-[60] flex lg:hidden" id="mobile-nav-panel" onClose={toggleOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in-out duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <div className="relative flex h-full w-full flex-col overflow-y-auto px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(5.5rem,env(safe-area-inset-top))] sm:px-8">
                <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.4em] text-neutral-600">Menu</p>
                <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
                  {navSections.map((section, index) => (
                    <MobileNavItem
                      activeLayoutId="headerActivePillMobile"
                      current={section === currentSection}
                      index={index}
                      key={section}
                      onClick={toggleOpen}
                      section={section}
                    />
                  ))}
                </nav>
                <p className="mt-auto pt-12 text-center text-xs text-neutral-600">Shubham Deo · Full Stack Developer</p>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>
      </>
    );
  },
);

const MobileNavItem: FC<{
  section: string;
  current: boolean;
  activeLayoutId?: string;
  onClick?: () => void;
  index: number;
}> = memo(({section, current, activeLayoutId, onClick, index}) => {
  return (
    <motion.div
      animate={{opacity: 1, y: 0}}
      initial={{opacity: 0, y: 20}}
      transition={{delay: 0.06 * index + 0.1, duration: 0.5, ease: floatEase}}>
      <Link
        className={classNames(
          'group relative flex items-center gap-4 rounded-2xl px-6 py-4 text-left transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
          current ? 'text-white' : 'text-neutral-400 hover:text-white',
        )}
        href={`/#${section}`}
        onClick={onClick}>
        {current && (
          <motion.span
            animate={{opacity: 1}}
            className="absolute inset-0 rounded-2xl border border-orange-400/30 bg-orange-500/10"
            initial={{opacity: 0}}
            layoutId={activeLayoutId}
            transition={{type: 'spring', stiffness: 320, damping: 28}}
          />
        )}
        <span className="relative z-10 font-mono text-xs text-orange-400/80">{String(index + 1).padStart(2, '0')}</span>
        <span className="relative z-10 flex-1 basis-6 text-left text-2xl font-semibold first-letter:uppercase">
          {navLabels[section] ?? section}
        </span>
        <motion.span
          animate={{x: current ? 2 : 0}}
          aria-hidden="true"
          className="relative z-10 text-neutral-600 transition-colors duration-300 group-hover:text-orange-400">
          →
        </motion.span>
      </Link>
    </motion.div>
  );
});

const NavItem: FC<{section: string; current: boolean; activeLayoutId?: string; onClick?: () => void}> = memo(
  ({section, current, activeLayoutId, onClick}) => {
    return (
      <Link
        className={classNames(
          'relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
          current ? 'text-white' : 'text-neutral-400 hover:text-white',
        )}
        href={`/#${section}`}
        onClick={onClick}>
        {current && (
          <motion.span
            animate={{opacity: 1}}
            className="absolute inset-0 rounded-full border border-orange-400/30 bg-orange-500/15"
            initial={{opacity: 0}}
            layoutId={activeLayoutId}
            transition={{type: 'spring', stiffness: 320, damping: 28}}
          />
        )}
        <span className="relative z-10 first-letter:uppercase">{navLabels[section] ?? section}</span>
      </Link>
    );
  },
);

Header.displayName = 'Header';
export default Header;
