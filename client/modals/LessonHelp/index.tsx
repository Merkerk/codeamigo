// @ts-ignore
import Cal, { getCalApi } from '@calcom/embed-react';
import React, { useEffect } from 'react';

import Icon from '👨‍💻components/Icon';

const LessonHelp: React.FC<Props> = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal('ui', {
        hideEventTypeDetails: false,
        styles: { branding: { brandColor: '#000000' } },
      });
    })();
  }, []);

  return (
    <div className="flex flex-col overflow-hidden rounded-md text-white sm:min-w-[320px]">
      <div className="bg-black px-2.5 py-1.5 font-bold">Get Help</div>
      <div
        className={`group flex cursor-pointer items-center gap-2 border-b border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-sm last:border-b-0 hover:bg-neutral-700`}
        data-cal-link="philip-london-8tgg0u/codeamigo-support"
        onClick={() => {}}
      >
        <Icon className="" name="old-phone" />- Schedule a call with a
        Co-Founder
        <Icon className="hidden group-hover:flex" name="right-open" />
      </div>
      <div
        className={`group flex cursor-pointer items-center gap-2 border-b border-neutral-800 px-2.5 py-1.5 text-sm last:border-b-0 hover:bg-neutral-700`}
        onClick={() => {
          window.open('https://github.com/codeamigo/issues/issues', '_blank');
        }}
      >
        <Icon className="" name="github" />- Open a GitHub Issue
        <Icon className="hidden group-hover:flex" name="right-open" />
      </div>
      <div
        className={`group flex cursor-pointer items-center gap-2 border-b border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-sm last:border-b-0 hover:bg-neutral-700`}
        onClick={() => {
          window.open('https://twitter.com/codeamigo_dev', '_blank');
        }}
      >
        <Icon className="" name="twitter" />- Yell at us on Twitter
        <Icon className="hidden group-hover:flex" name="right-open" />
      </div>
    </div>
  );
};

type Props = {};

export default LessonHelp;
