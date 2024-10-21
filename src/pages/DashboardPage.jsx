import Head from "@components/dashboard/Head";
import TaskList from "@components/dashboard/TaskList";

const DashboardPage = () => {
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-6xl p-13">
        <Head />
        <br />
        <TaskList />
      </div>
    </div>
  );
};

export default DashboardPage;
