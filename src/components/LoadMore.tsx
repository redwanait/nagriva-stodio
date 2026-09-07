interface LoadMoreProps {
  onClick: () => void;
  loading?: boolean;
}

export default function LoadMore({ onClick, loading }: LoadMoreProps) {
  return (
    <div className="load-more">
      <button
        className="load-more__button"
        type="button"
        onClick={onClick}
        disabled={loading}
      >
        {loading ? "Loading…" : "Load more"}
      </button>
    </div>
  );
}
