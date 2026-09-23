import {FC, memo} from 'react';

import {SectionId, skills} from '../../../data/data';
import Section from '../../Layout/Section';
import ResumeBackground from './Background';
import ResumeSection from './ResumeSection';
import {SkillGroup} from './Skills';

const Resume: FC = memo(() => {
  return (
    <Section className="relative overflow-hidden bg-neutral-100" sectionId={SectionId.Resume}>
      <ResumeBackground />
      <div className="relative z-10 flex flex-col">
        <ResumeSection title="Skills">
          <p className="pb-8">
            Technologies and tools I use to build responsive, scalable, and user-friendly products.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {skills.map((skillgroup, index) => (
              <SkillGroup index={index} key={`${skillgroup.name}-${index}`} skillGroup={skillgroup} />
            ))}
          </div>
        </ResumeSection>
      </div>
    </Section>
  );
});

Resume.displayName = 'Resume';
export default Resume;
