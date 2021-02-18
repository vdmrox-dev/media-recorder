export default function Tab(props) {
  const handleTabClick = () => {
    props.onClick();
  };
  return (
    <div
      onClick={() => handleTabClick()}
      className={`tab-item ${props.isActive ? "active" : null}`}
    >
      {props.label}
    </div>
  );
}
