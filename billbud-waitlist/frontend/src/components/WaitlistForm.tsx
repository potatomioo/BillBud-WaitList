export default function WaitlistForm() {
  const handleDownload = () => {
    window.location.href = "https://play.google.com/store/apps/details?id=com.potatobuilds.spliq";
  };

  return (
    <div className="waitlist-container">
      <div className="waitlist-form">
        <button
          onClick={handleDownload}
          className="submit-button"
        >
          Download from here
        </button>
      </div>
      <p className="reassurance-text">No spam. BillBud is now live.</p>
    </div>
  );
}
