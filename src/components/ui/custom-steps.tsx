"use client";
function CustomSteps({ activeStep, text }: { activeStep: string; text: string }) {
  return (
    <>
      <div className="cover flex justify-center items-center py-10">
        <ul className="steps steps-vertical steps-horizontal w-90 sm:w-200 text-sm sm:text-md">
          <li
            className={`step after:bg-main! after:border-main! after:text-white!`}
            data-content={activeStep === "sessionCalendar" ? "✓" : "1"}
          >
            Choose Plan
          </li>
          <li
            className={`step ${
              activeStep === "sessionCalendar" &&
              "after:bg-main! after:text-white! after:border-main! before:bg-main! "
            }`}
          >
            Booking
          </li>
          <li className="step">Purchase</li>
        </ul>
      </div>
      <div className="head">
        <h1 className="py-5 text-2xl font-bold border-b border-second-dark text-center">
          {text}
        </h1>
      </div>
    </>
  );
}

export default CustomSteps;
