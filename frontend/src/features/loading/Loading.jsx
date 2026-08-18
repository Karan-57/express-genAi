import "./Loading.scss";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <h2>Generating Content, it may take some time</h2>
    </div>
  );
};

export default Loading;