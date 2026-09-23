import {motion, Variants} from 'framer-motion';
import {FC, memo, PropsWithChildren} from 'react';

import {Skill as SkillType, SkillGroup as SkillGroupType} from '../../../data/dataDef';
import {GradientText} from '../../ui/AnimatedText';

const easing = [0.175, 0.885, 0.32, 1.275] as const;

const cardVariants: Variants = {
  hidden: {opacity: 0, y: 40},
  show: {opacity: 1, y: 0, transition: {duration: 0.6, ease: easing}},
};

const tagGroupVariants: Variants = {
  hidden: {},
  show: {transition: {staggerChildren: 0.06, delayChildren: 0.15}},
};

const tagVariants: Variants = {
  hidden: {opacity: 0, scale: 0.8, y: 12},
  show: {opacity: 1, scale: 1, y: 0, transition: {duration: 0.45, ease: easing}},
};

const formatIndex = (index: number): string => (index + 1).toString().padStart(2, '0');

export const SkillGroup: FC<PropsWithChildren<{index: number; skillGroup: SkillGroupType}>> = memo(
  ({index, skillGroup}) => {
    const {name, skills} = skillGroup;

    return (
      <motion.div
        className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:p-7"
        initial="hidden"
        variants={cardVariants}
        viewport={{once: true, margin: '-60px'}}
        whileInView="show">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-orange-500 via-orange-400 to-cyan-500 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="mb-5 flex items-baseline gap-3">
          <span className="font-mono text-xs font-bold text-orange-500">{formatIndex(index)}</span>
          <h3 className="text-lg font-extrabold tracking-tight">
            <GradientText gradient="from-orange-500 via-orange-400 to-cyan-500">{name}</GradientText>
          </h3>
        </div>
        <motion.div
          className="flex flex-wrap gap-2"
          initial="hidden"
          variants={tagGroupVariants}
          viewport={{once: true, margin: '-60px'}}
          whileInView="show">
          {skills.map((skill, skillIndex) => (
            <Skill key={`${skill.name}-${skillIndex}`} skill={skill} />
          ))}
        </motion.div>
      </motion.div>
    );
  },
);

SkillGroup.displayName = 'SkillGroup';

export const Skill: FC<{skill: SkillType}> = memo(({skill}) => {
  const {name} = skill;

  return (
    <motion.span
      className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400 hover:bg-white hover:text-orange-600 hover:shadow-md"
      variants={tagVariants}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-orange-500 to-cyan-500 transition-transform duration-300 group-hover:scale-125" />
      {name}
    </motion.span>
  );
});

Skill.displayName = 'Skill';
