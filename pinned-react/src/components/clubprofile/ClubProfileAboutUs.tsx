const ClubProfileAboutUs = ({ hasScrolledAboutUs }) => {
    return (
      <div
        className={`relative z-10 flex flex-col -top-32 items-center justify-center mt-24 px-6 w-full max-w-3xl mx-auto transition-opacity duration-1000 ${
          hasScrolledAboutUs ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h3 className="text-lg font-large text-purple-500">ABOUT US</h3>
        <p className="mt-4 text-center text-lg">
          The National Society of Black Engineers (NSBE) is a society that was founded in 1975 at Purdue University, located in West Lafayette, Indiana. It is one of the largest student-run organizations in the United States, with core activities centered on improving the recruitment and retention of Black and other minority engineers in both academia and industry.
        </p>
        <button className="mt-6 w-48 px-6 py-2 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition duration-300">
          Join Us
        </button>
      </div>
    );
  };
  
  export default ClubProfileAboutUs;
  