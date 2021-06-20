import withApollo from '👨‍💻utils/withApollo';
import Dependencies from '👨‍💻widgets/HomepageFilters/Dependencies';
import Levels from '👨‍💻widgets/HomepageFilters/Levels';
import LessonsList from '👨‍💻widgets/LessonsList';

const Home = () => {
  return (
    <div className="flex flex-col sm:space-x-8 sm:flex-row">
      <div className="sm:w-1/4 w-full mb-4">
        <Dependencies />
        <Levels />
      </div>
      <div className="sm:w-3/4 w-full">
        <LessonsList />
      </div>
    </div>
  );
};

export default withApollo({ ssr: true })(Home);
