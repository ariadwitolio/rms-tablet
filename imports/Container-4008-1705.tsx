import svgPaths from "./svg-u3i5bipahb";
import imgImg from "figma:asset/19869fce8ee021dc83a73d48a4918a17d356f441.png";

function Img() {
  return (
    <div className="h-[21px] relative shrink-0 w-[120px]" data-name="img">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImg} />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[71px] relative shrink-0 w-[187px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[20px] relative size-full">
        <Img />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_4008_1714)" id="Icon">
          <path d={svgPaths.p3af0d580} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3514ce64} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.pbe0900} id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 5.25H16.5" id="Vector_4" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3d952b80} id="Vector_5" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_4008_1714">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Span() {
  return (
    <div className="h-[24px] relative shrink-0 w-[50.945px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[24px] left-[25.5px] not-italic text-[#282828] text-[16px] text-center top-0 whitespace-nowrap">Service</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[71px] items-center justify-center left-[215.5px] pl-px pr-[1.008px] top-0 w-[180px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-l border-r border-solid inset-0 pointer-events-none" />
      <Icon />
      <Span />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1f7ee380} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p6466980} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 13.125V4.875" id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Span1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[41.398px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[24px] left-[21px] not-italic text-[#282828] text-[16px] text-center top-0 whitespace-nowrap">Order</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[71px] items-center justify-center left-[395.5px] pl-px pr-[1.008px] top-0 w-[180px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-l border-r border-solid inset-0 pointer-events-none" />
      <Icon1 />
      <Span1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1f0b6880} id="Vector" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p121a8900} id="Vector_2" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 9H10.5" id="Vector_3" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Span2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[82.375px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[24px] left-[41.5px] not-italic text-[#006bff] text-[16px] text-center top-0 whitespace-nowrap">Transaction</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-[#f3f7fe] content-stretch flex gap-[8px] h-[71px] items-center justify-center left-[575.5px] px-px top-0 w-[180px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-l border-r border-solid inset-0 pointer-events-none" />
      <Icon2 />
      <Span2 />
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[1_0_0] h-[72px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Button />
        <Button1 />
        <Button2 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function DoorClosed() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="DoorClosed">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="DoorClosed">
          <path d={svgPaths.p3f02fd00} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 13.3333H14.6667" id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M9.33333 8V8.00667" id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Span3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[65px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Medium',sans-serif] leading-[20px] left-[32px] not-italic text-[#282828] text-[14px] text-center top-[0.5px] whitespace-nowrap">Close POS</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white h-[48px] relative rounded-[12px] shrink-0 w-[123px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center p-px relative size-full">
        <DoorClosed />
        <Span3 />
      </div>
    </div>
  );
}

function Menu() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Menu">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Menu">
          <path d="M2.66667 8H13.3333" id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 4H13.3333" id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 12H13.3333" id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 size-[48px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Menu />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[48px] relative shrink-0 w-[211px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button3 />
        <Button4 />
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch flex items-center pb-px relative size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid inset-0 pointer-events-none" />
      <Container1 />
      <Container2 />
      <Container3 />
    </div>
  );
}