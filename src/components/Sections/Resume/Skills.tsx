import {FC, memo, PropsWithChildren} from 'react';

import {Skill as SkillType, SkillGroup as SkillGroupType} from '../../../data/dataDef';

export const SkillGroup: FC<PropsWithChildren<{skillGroup: SkillGroupType}>> = memo(({skillGroup}) => {
  const {name, skills} = skillGroup;
  return (
    <div className="flex flex-col">
      <span className="text-center text-lg font-bold">{name}</span>
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
        {skills.map((skill, index) => (
          <Skill key={`${skill.name}-${index}`} skill={skill} />
        ))}
      </div>
    </div>
  );
});

SkillGroup.displayName = 'SkillGroup';

export const Skill: FC<{skill: SkillType}> = memo(({skill}) => {
  const {name} = skill;

  return (
    <span className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700">
      {name}
    </span>
  );
});

Skill.displayName = 'Skill';
