import svgPaths from "./svg-0mbrad7amz";

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p203476e0} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 8H3.33333" id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[48px] relative rounded-[12px] shrink-0 w-[50px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="bg-[#fef9c2] h-[22px] relative rounded-[12px] shrink-0 w-[85.914px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] size-full">
        <p className="font-['Lato:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#a65f00] text-[12px] text-right">Partially Paid</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#ffdf20] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[12px] h-[30px] items-center relative shrink-0 w-full" data-name="Container">
      <p className="font-['Lato:Bold',sans-serif] leading-[30px] not-italic relative shrink-0 text-[#282828] text-[20px]">Table 1</p>
      <Text />
    </div>
  );
}

function Container1() {
  return (
    <div className="flex-[1_0_0] h-[56px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative size-full">
        <Container2 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[56px] relative shrink-0 w-[296.336px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button />
        <Container1 />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p38fdee00} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p13058e80} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3b81ea80} id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3b3a5000} id="Vector_4" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[24px] relative rounded-[12px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] h-full items-center px-[8px] relative">
        <Icon1 />
        <p className="font-['Lato:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#282828] text-[12px]">4 pax</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2152_71)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 3V6L8 7" id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2152_71">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-[24px] relative rounded-[12px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] h-full items-center px-[8px] relative">
        <Icon2 />
        <p className="font-['Lato:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#282828] text-[12px]">3m/90m</p>
      </div>
    </div>
  );
}

function Group() {
  return <div className="absolute contents inset-0" />;
}

function Group1() {
  return (
    <div className="absolute inset-[21.12%_10.92%_21.08%_10.87%]">
      <div className="absolute inset-[-6.49%_-4.79%_-6.49%_-4.8%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.7145 10.4479">
          <g id="Group 1581">
            <path d={svgPaths.p37e92050} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.2" />
            <circle cx="6.83299" cy="6.39122" id="Ellipse 9" r="1.61174" stroke="var(--stroke-0, #282828)" />
            <path d={svgPaths.p2890ee00} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[24px] relative rounded-[12px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] h-full items-center px-[8px] relative">
        <div className="relative shrink-0 size-[16px]" data-name="Cash">
          <Group />
          <Group1 />
        </div>
        <p className="font-['Lato:Medium',sans-serif] leading-[0] not-italic relative shrink-0 text-[#282828] text-[12px]">
          <span className="leading-[16px]">{`Rp `}</span>
          <span className="leading-[16px] text-[#d0021b]">100.000</span>
          <span className="leading-[16px]">{` / 300.000`}</span>
        </p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[22px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-full items-center relative">
        <Frame2 />
        <Frame1 />
        <Frame />
      </div>
    </div>
  );
}

export default function TableHeader() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between pb-px px-[24px] relative size-full" data-name="Table Header">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid inset-0 pointer-events-none" />
      <Container />
      <Container3 />
    </div>
  );
}