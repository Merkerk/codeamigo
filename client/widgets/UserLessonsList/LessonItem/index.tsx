import { useRouter } from 'next/router';
import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import { LessonsQuery, useMeQuery } from '👨‍💻generated/graphql';
import LanguageBar from '👨‍💻widgets/LessonsList/LanguageBar';

const LessonItem: React.FC<Props> = ({ lesson }) => {
  const { data: meData } = useMeQuery();
  const router = useRouter();

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: number
  ) => {
    e.preventDefault();
    if (meData?.me?.isAuthenticated) {
      router.push(`/lessons/start/${id}`);
    } else {
      modalVar({
        callback: () => router.push(`/lessons/start/${id}`),
        name: 'login',
      });
    }
  };

  return (
    <div className="p-3 rounded-lg border-gray-200 border" key={lesson.id}>
      <a
        className="text-md text-blue-600 font-semibold hover:underline"
        href="/"
        onClick={(e) => handleClick(e, lesson.id)}
      >
        {lesson.title}
      </a>
      <h3 className="text-xs">By: {lesson.owner.username}</h3>
      <div className="flex justify-between mt-4 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="grid grid-cols-2 gap-0.5">
            <Icon className="text-gray-500" name="users" />{' '}
            <div>{lesson.students?.length}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 text-xs">
        <LanguageBar steps={lesson.steps} />
        <div>{new Date(parseInt(lesson.createdAt)).toDateString()}</div>
      </div>
    </div>
  );
};

type Props = {
  lesson: LessonsQuery['lessons'][0];
};

export default LessonItem;
