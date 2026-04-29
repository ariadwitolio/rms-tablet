import svgPaths from "./svg-nmj8kdn547";

export default function MainBtn() {
  return (
    <div className="bg-white content-stretch flex gap-[10px] items-center justify-center px-[24px] py-[16px] relative rounded-[12px] size-full" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border border-[#006bff] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="relative shrink-0 size-[20px]" data-name="Chevron left">
        <div className="absolute bottom-1/4 left-[33.33%] right-[41.67%] top-1/4" data-name="Vector">
          <div className="absolute inset-[-6%_-12%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.2 11.2">
              <path d="M5.6 0.6L0.6 5.6L5.6 10.6" id="Vector" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            </svg>
          </div>
        </div>
      </div>
      <p className="font-['Lato:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#006bff] text-[16px] text-center tracking-[0.11px]">Action</p>
      <div className="relative shrink-0 size-[18px]" data-name="save">
        <div className="absolute inset-[15.04%]">
          <div className="absolute inset-[-4.77%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.785 13.785">
              <g id="Group 1739">
                <path d={svgPaths.p1533ad40} id="Vector" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                <path d={svgPaths.p22e83300} id="Vector_2" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                <path d="M6.89242 10.0275V0.6" id="Vector_3" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}