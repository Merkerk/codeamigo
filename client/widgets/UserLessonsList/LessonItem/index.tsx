import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Icon from '👨‍💻components/Icon';
import {
  LessonsQuery,
  useDeleteLessonMutation,
  useMeQuery,
  useUpdateLessonStatusMutation,
} from '👨‍💻generated/graphql';
import LanguageBar from '👨‍💻widgets/LessonsList/LanguageBar';

const LessonItem: React.FC<Props> = ({ lesson }) => {
  const { data: meData } = useMeQuery();
  const [deleteLessonM] = useDeleteLessonMutation();
  const [updateLessonStatusM] = useUpdateLessonStatusMutation();
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

  const deleteLesson = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();
    const yes = window.confirm('Are you sure you want to delete this lesson?');
    if (yes) {
      await deleteLessonM({
        refetchQueries: ['UserLessons'],
        variables: { id },
      });
    }
  };

  const publishLesson = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();
    await updateLessonStatusM({
      refetchQueries: ['UserLessons'],
      variables: { id, status: 'PENDING_PUBLISH' },
    });
  };

  return (
    <div className="p-3 rounded-lg border-gray-200 border" key={lesson.id}>
      <div className="flex justify-between items-start">
        <a
          className="text-md text-blue-600 font-semibold hover:underline"
          href="/"
          onClick={(e) => handleClick(e, lesson.id)}
        >
          {lesson.title}
        </a>
        <div className="relative z-10">
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button
                  aria-haspopup="true"
                  className={`flex text-sm outline-none focus:outline-none`}
                >
                  <span className="sr-only">Open lesson menu</span>
                  <Icon className="text-gray-400" name="dot-3" />
                </Menu.Button>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                  show={open}
                >
                  <div
                    aria-labelledby="session-menu"
                    aria-orientation="vertical"
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                    role="menu"
                  >
                    {lesson.status === 'EDITTING' && (
                      <button
                        className="w-full flex items-center text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => publishLesson(e, lesson.id)}
                        role="menuitem"
                      >
                        <Icon className="text-blue-500 mr-2" name="rocket" />
                        <span>Publish Lesson</span>
                      </button>
                    )}
                    <button
                      className="w-full flex items-center text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => router.push(`/lessons/edit/${lesson.id}`)}
                      role="menuitem"
                    >
                      <Icon className="mr-2" name="keyboard" />{' '}
                      <span>Edit Lesson</span>
                    </button>
                    <button
                      className="w-full flex items-center text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={(e) => deleteLesson(e, lesson.id)}
                      role="menuitem"
                    >
                      <Icon className="text-red-500 mr-2" name="trash" />{' '}
                      <span>Delete Lesson</span>
                    </button>
                  </div>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </div>
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
