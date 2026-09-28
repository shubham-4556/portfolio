import {Dialog, Transition} from '@headlessui/react';
import {Bars3BottomRightIcon} from '@heroicons/react/24/outline';
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
        className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden justify-center px-4 pt-3 sm:flex sm:pt-4"
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
      setIsOpen(!isOpen);
    }, [isOpen]);

    return (
      <>
        <button
          aria-label="Open menu"
          className="fixed right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] z-40 rounded-full border border-white/10 bg-black/55 p-2.5 text-white shadow-lg shadow-black/40 backdrop-blur-xl transition-colors duration-300 hover:border-orange-400/40 hover:text-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] sm:hidden"
          onClick={toggleOpen}>
          <Bars3BottomRightIcon className="h-6 w-6" />
          <span className="sr-only">Open navigation menu</span>
        </button>
        <Transition.Root as={Fragment} show={isOpen}>
          <Dialog as="div" className="fixed inset-0 z-40 flex sm:hidden" onClose={toggleOpen}>
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
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full">
              <div className="relative w-4/5 border-r border-white/10 bg-[#080808]/95 backdrop-blur-xl">
                <nav className="mt-5 flex flex-col gap-y-2 px-3">
                  {navSections.map(section => (
                    <NavItem
                      activeLayoutId="headerActivePillMobile"
                      current={section === currentSection}
                      key={section}
                      onClick={toggleOpen}
                      section={section}
                    />
                  ))}
                </nav>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>
      </>
    );
  },
);

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
