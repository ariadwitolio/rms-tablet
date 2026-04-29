export default function NominalStepper() {
  return (
    <div className="content-stretch flex gap-[4px] items-end relative size-full" data-name="Nominal Stepper">
      <div className="bg-[#f4f4f4] content-stretch flex items-center justify-center p-[16px] relative rounded-[12px] shrink-0 size-[44px]" data-name="Reduce Container Disabled">
        <div className="relative shrink-0 size-[20px]" data-name="Reduce">
          <div className="absolute bottom-1/2 left-[18.75%] right-[18.75%] top-1/2" data-name="Vector">
            <div className="absolute inset-[-0.6px_-4.8%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.7 1.2">
                <path d="M0.6 0.6H13.1" id="Vector" stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[8px] h-[44px] items-center justify-end relative shrink-0 w-[88px]" data-name="Amount Container">
        <p className="font-['Lato:Bold',sans-serif] leading-[30px] not-italic relative shrink-0 text-[#282828] text-[20px] text-center tracking-[0.1375px]">1</p>
        <div className="h-px relative shrink-0 w-full" data-name="Line">
          <div className="absolute inset-[0_1.93%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 84.6 1">
              <path d="M0.5 0.5H84.1" id="Line" stroke="var(--stroke-0, #E9E9E9)" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-[#006bff] content-stretch flex items-center justify-center p-[16px] relative rounded-[12px] shrink-0 size-[44px]" data-name="Reduce Container Disabled">
        <div className="relative shrink-0 size-[20px]" data-name="Add">
          <div className="absolute inset-[20.75%_20.83%_21%_20.88%]">
            <div className="absolute inset-[-5.15%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8582 12.8501">
                <g id="Group 1644">
                  <path d="M0.6 6.42502H12.2582" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  <path d="M6.43293 0.6V12.2501" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}