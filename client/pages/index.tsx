import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import { LessonsDocument, LessonsQuery } from '👨‍💻generated/graphql';
import { client } from '👨‍💻utils/withApollo';

const Home = (props: Props) => {
  const router = useRouter();
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'a') {
        // open a new window
        window.open('https://forms.gle/weRYdVmr2LszmQiK6');
      } else if (event.key === 'd') {
        router.push(`/v2/lesson/hello-codeamigo/step/intro`);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-between sm:shrink-0 lg:flex-row">
      <div className="mt-10 w-full max-w-3xl lg:mt-0">
        <span className=" inline-flex h-6 cursor-default select-none items-center whitespace-nowrap rounded bg-[#330000] px-2 text-xs font-semibold text-red-500">
          Currently in beta
        </span>
        <h1 className=" mt-2 bg-gradient-to-br from-white to-neutral-600 bg-clip-text text-[35px] font-bold leading-[42px] tracking-[-0.64px] text-transparent sm:text-6xl sm:leading-[68px] sm:tracking-[-0.896px]">
          <span className="inline-block max-w-[525px] align-top">
            Learn to Code
            <br />
            Like a Developer
          </span>
        </h1>
        <p className=" mb-8 mt-4 text-base font-normal text-neutral-600">
          <span className="inline-block max-w-[591px] align-top">
            Codeamigo is an AI powered coding assitant that helps you learn to
            code like a developer. Today's developers didn't learn C before
            learning Python, why should you learn how to code without the most
            modern tools?
          </span>
        </p>
        <button
          className=" group hidden select-none items-center gap-2 text-sm font-semibold text-neutral-600 outline-none transition duration-200 ease-in-out hover:text-neutral-600 focus:text-neutral-600 sm:inline-flex"
          onClick={() => {
            window.open('https://forms.gle/weRYdVmr2LszmQiK6');
          }}
        >
          Press{' '}
          <kbd className="group-hover:neutral-700 group-focus:neutral-700 inline-flex h-[22px] w-[22px] select-none items-center justify-center rounded bg-neutral-400 text-sm uppercase text-black transition duration-200 ease-in-out group-focus:text-black">
            A
          </kbd>{' '}
          to request access{' '}
        </button>
        <button
          className=" group hidden select-none items-center gap-2 text-sm font-semibold text-neutral-600 outline-none transition duration-200 ease-in-out hover:text-neutral-600 focus:text-neutral-600 sm:inline-flex"
          onClick={() => {
            router.push('/v2/lesson/hello-codeamigo/step/intro');
          }}
        >
          or{' '}
          <kbd className="group-hover:neutral-700 group-focus:neutral-700 inline-flex h-[22px] w-[22px] select-none items-center justify-center rounded bg-neutral-400 text-sm uppercase text-black transition duration-200 ease-in-out group-focus:text-black">
            D
          </kbd>{' '}
          to demo.
        </button>
      </div>
      <div className="w-full max-w-3xl lg:w-3/4">
        <div className="grid grid-cols-2 gap-10 sm:mt-8 lg:mt-0 lg:grid-cols-2 lg:gap-6">
          {props.lessons
            .filter((lesson) => lesson.slug !== 'intro-to-python')
            .map((lesson) => {
              return (
                <div
                  className="grainy-image-parent group overflow-hidden rounded-md border-neutral-400 shadow-lg shadow-neutral-700/50 transition-all hover:shadow-xl hover:shadow-blue-500/50"
                  onClick={() => {
                    router.push(
                      `/v2/lesson/${lesson.slug}/step/${lesson.steps?.[0].slug}`
                    );
                  }}
                  role="button"
                >
                  <div className="grainy-image transition-all group-hover:grayscale-0">
                    <img className="w-full" src={lesson.thumbnail!} />
                  </div>
                  <div className="px-3 pb-4 pt-2 text-xs">
                    <pre className="text-white">{lesson.title}</pre>
                    <Button className="mt-3">
                      {lesson.slug === 'hello-codeamigo' ? (
                        <span>Demo</span>
                      ) : (
                        <span>Start</span>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-10 lg:grid-cols-3 lg:gap-6">
          {props.lessons
            .filter((lesson) => lesson.slug === 'intro-to-python')
            .map((lesson) => {
              return (
                <div
                  className="overflow-hidden rounded-md border-neutral-400 shadow-lg shadow-neutral-700/50 transition-all hover:shadow-xl hover:shadow-blue-500/50"
                  // onClick={() => {
                  //   window.open(
                  //     `/v2/lesson/${lesson.slug}/step/${lesson.steps?.[0].slug}`
                  //   );
                  // }}
                  // role="button"
                >
                  <div className="grainy-image transition-all group-hover:grayscale-0">
                    <img className="w-full" src={lesson.thumbnail!} />
                  </div>
                  <div className="px-3 pb-4 pt-2 text-xs">
                    <pre className="text-white">{lesson.title}</pre>
                    <span className="mt-3 inline-flex h-6 cursor-default select-none items-center whitespace-nowrap rounded bg-blue-950 px-2 text-xs font-semibold text-blue-500">
                      Coming{' '}
                      {lesson.slug === 'intro-to-js' ? 'May 1st' : 'Soon'}
                    </span>
                    <Button
                      className="mt-3"
                      onClick={() =>
                        window.open(
                          'https://forms.gle/weRYdVmr2LszmQiK6',
                          '_blank'
                        )
                      }
                    >
                      <Icon className="mr-1.5" name="plus-circled" />
                      <span>Join Waitlist</span>
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

type Props = {
  lessons: LessonsQuery['lessons'];
};

export const getServerSideProps = async () => {
  const lessons = await client.query({
    query: LessonsDocument,
  });

  return {
    props: {
      lessons: lessons.data.lessons,
    },
  };
};

export default Home;
