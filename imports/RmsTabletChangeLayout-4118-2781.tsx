import svgPaths from "./svg-15btcibr03";
import imgImg from "figma:asset/19869fce8ee021dc83a73d48a4918a17d356f441.png";
import { imgGroup } from "./svg-ijhcr";

function Button() {
  return (
    <div className="bg-[#e6f0ff] h-[44px] relative rounded-[9999px] shrink-0 w-[96.625px]" data-name="button">
      <div aria-hidden="true" className="absolute border border-[#006bff] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[25px] py-px relative size-full">
        <p className="font-['Lato:Bold',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#006bff] text-[14px] text-center whitespace-nowrap">Dine-In</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[44px] relative rounded-[9999px] shrink-0 w-[109.57px]" data-name="button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[25px] py-px relative size-full">
        <p className="font-['Lato:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#282828] text-[14px] text-center whitespace-nowrap">Takeaway</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[44px] relative rounded-[9999px] shrink-0 w-[101.344px]" data-name="button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[25px] py-px relative size-full">
        <p className="font-['Lato:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#282828] text-[14px] text-center whitespace-nowrap">Delivery</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-white h-[65px] relative shrink-0 w-[1369px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pb-px pl-[20px] relative size-full">
        <Button />
        <Button1 />
        <Button2 />
      </div>
    </div>
  );
}

function Div2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[26px] items-start justify-center left-[24px] top-[20px] w-[119px]" data-name="div">
      <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[#282828] text-[16px] tracking-[0.1238px] whitespace-nowrap">Ground Floor</p>
    </div>
  );
}

function Div3() {
  return <div className="absolute bg-[#006bff] h-[66px] left-0 top-0 w-[6px]" data-name="div" />;
}

function Button3() {
  return (
    <div className="absolute bg-[#c6efec] border-[#d4d4d4] border-b border-solid h-[67px] left-0 top-0 w-[159px]" data-name="button">
      <Div2 />
      <Div3 />
    </div>
  );
}

function Div4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[26px] items-start justify-center left-[24px] top-[20px] w-[119px]" data-name="div">
      <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[#535353] text-[16px] tracking-[0.1238px] whitespace-nowrap">Mezzanine</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[#fff4e6] border-[#d4d4d4] border-b border-solid h-[67px] left-0 top-[67px] w-[159px]" data-name="button">
      <Div4 />
    </div>
  );
}

function Div5() {
  return (
    <div className="absolute content-stretch flex flex-col h-[26px] items-start justify-center left-[24px] top-[20px] w-[119px]" data-name="div">
      <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[#535353] text-[16px] tracking-[0.1238px] whitespace-nowrap">Rooftop</p>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[#f2eaf7] border-[#d4d4d4] border-b border-solid h-[67px] left-0 top-[134px] w-[159px]" data-name="button">
      <Div5 />
    </div>
  );
}

function Div1() {
  return (
    <div className="h-[201px] relative shrink-0 w-full" data-name="div">
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function ScrollAreaPrimitiveViewport() {
  return (
    <div className="content-stretch flex flex-col h-[848px] items-start overflow-clip relative shrink-0 w-full" data-name="ScrollAreaPrimitive.Viewport">
      <Div1 />
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[848px] items-start pr-px relative shrink-0 w-[160px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-r border-solid inset-0 pointer-events-none" />
      <ScrollAreaPrimitiveViewport />
    </div>
  );
}

function Container8() {
  return <div className="absolute border-[#e9e9e9] border-[1.791px] border-solid h-[716.418px] left-0 rounded-[9.552px] top-[61px] w-[895.522px]" data-name="Container" />;
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_4118_2808)" id="Icon">
          <path d={svgPaths.p2cd5ea80} id="Vector" stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.16667 11.6667H2.91667" id="Vector_2" stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7.58333 11.6667H12.8333" id="Vector_3" stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.83333 7V7.00583" id="Vector_4" stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3c4c0b80} id="Vector_5" stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_4118_2808">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Span() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[82.492px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[19.5px] left-0 not-italic text-[#282828] text-[13px] top-[-0.5px] whitespace-nowrap">Main Entrance</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[6px] h-[40px] items-center pl-[9.5px] pr-[1.5px] py-[1.5px] relative rounded-[6px] shrink-0 w-[150px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Icon />
      <Span />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p124a2580} id="Vector" stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p206e4880} id="Vector_2" stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2237bd80} id="Vector_3" stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Span1() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[42.75px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[19.5px] left-0 not-italic text-[#282828] text-[13px] top-[-0.5px] whitespace-nowrap">Cashier</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex gap-[6px] h-[40px] items-center pl-[9.5px] pr-[1.5px] py-[1.5px] relative rounded-[6px] shrink-0 w-[110px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Icon1 />
      <Span1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex gap-[20px] items-center left-0 top-0">
      <Container9 />
      <Container10 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p19116100} id="Vector" stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M3.4999 9.91665H10.4999" id="Vector_2" stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Span2() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[42.75px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[19.5px] left-0 not-italic text-[#282828] text-[13px] top-[-0.5px] whitespace-nowrap">Kitchen</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[40px] items-center left-[23.88px] pl-[9.5px] pr-[1.5px] py-[1.5px] rounded-[6px] top-[608.96px] w-[110px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Icon2 />
      <Span2 />
    </div>
  );
}

function P() {
  return (
    <div className="h-[23.284px] relative shrink-0 w-[40.984px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[15.522px] left-[21.16px] not-italic text-[#282828] text-[15.522px] text-center top-[-1.49px] whitespace-nowrap">T02</p>
      </div>
    </div>
  );
}

function P1() {
  return (
    <div className="h-[29.552px] relative shrink-0 w-[47.127px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[19.701px] left-[24.36px] not-italic text-[#7e7e7e] text-[13.134px] text-center top-[0.3px] whitespace-nowrap">4 pax</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-[#e8f5e9] content-stretch flex flex-col gap-[3.582px] items-center justify-center left-[225px] p-[2.388px] rounded-[9.552px] size-[161.194px] top-[163.28px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#2e7d32] border-[2.388px] border-solid inset-0 pointer-events-none rounded-[9.552px]" />
      <P />
      <P1 />
    </div>
  );
}

function P2() {
  return (
    <div className="h-[23.284px] relative shrink-0 w-[40.984px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[15.522px] left-[21.16px] not-italic text-[#282828] text-[15.522px] text-center top-[-1.49px] whitespace-nowrap">T01</p>
      </div>
    </div>
  );
}

function P3() {
  return (
    <div className="h-[29.552px] relative shrink-0 w-[47.127px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[19.701px] left-[24.36px] not-italic text-[#7e7e7e] text-[13.134px] text-center top-[0.3px] whitespace-nowrap">4 pax</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-[#e8f5e9] content-stretch flex flex-col gap-[3.582px] items-center justify-center left-[33.38px] p-[2.388px] rounded-[9.552px] size-[161.194px] top-[163.28px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#2e7d32] border-[2.388px] border-solid inset-0 pointer-events-none rounded-[9.552px]" />
      <P2 />
      <P3 />
    </div>
  );
}

function P4() {
  return (
    <div className="h-[23.284px] relative shrink-0 w-[40.984px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[15.522px] left-[21.16px] not-italic text-[#282828] text-[15.522px] text-center top-[-1.49px] whitespace-nowrap">T03</p>
      </div>
    </div>
  );
}

function P5() {
  return (
    <div className="h-[29.552px] relative shrink-0 w-[47.127px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[19.701px] left-[24.36px] not-italic text-[#7e7e7e] text-[13.134px] text-center top-[0.3px] whitespace-nowrap">4 pax</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute bg-[#e8f5e9] content-stretch flex flex-col gap-[3.582px] items-center justify-center left-[410.67px] p-[2.388px] rounded-[9.552px] size-[161.194px] top-[163.28px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#2e7d32] border-[2.388px] border-solid inset-0 pointer-events-none rounded-[9.552px]" />
      <P4 />
      <P5 />
    </div>
  );
}

function P6() {
  return (
    <div className="h-[28.657px] relative shrink-0 w-[50.443px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[19.104px] left-[25.36px] not-italic text-[#282828] text-[19.104px] text-center top-[-1.19px] whitespace-nowrap">T04</p>
      </div>
    </div>
  );
}

function P7() {
  return (
    <div className="h-[29.552px] relative shrink-0 w-[47.127px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[19.701px] left-[24.36px] not-italic text-[#7e7e7e] text-[13.134px] text-center top-[0.3px] whitespace-nowrap">2 pax</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute bg-[#e8f5e9] content-stretch flex flex-col gap-[3.582px] items-center justify-center left-[35.82px] p-[2.388px] rounded-[98.507px] size-[131.343px] top-[372.39px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#2e7d32] border-[2.388px] border-solid inset-0 pointer-events-none rounded-[98.507px]" />
      <P6 />
      <P7 />
    </div>
  );
}

function P8() {
  return (
    <div className="h-[28.657px] relative shrink-0 w-[50.443px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[19.104px] left-[25.36px] not-italic text-[#282828] text-[19.104px] text-center top-[-1.19px] whitespace-nowrap">T05</p>
      </div>
    </div>
  );
}

function P9() {
  return (
    <div className="h-[29.552px] relative shrink-0 w-[47.127px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[19.701px] left-[24.86px] not-italic text-[#7e7e7e] text-[13.134px] text-center top-[0.3px] whitespace-nowrap">2pax</p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute bg-[#e8f5e9] content-stretch flex flex-col gap-[3.582px] items-center justify-center left-[202.99px] p-[2.388px] rounded-[98.507px] size-[131.343px] top-[372.39px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#2e7d32] border-[2.388px] border-solid inset-0 pointer-events-none rounded-[98.507px]" />
      <P8 />
      <P9 />
    </div>
  );
}

function P10() {
  return (
    <div className="h-[23.284px] relative shrink-0 w-[40.984px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[15.522px] left-[21.16px] not-italic text-[#7e7e7e] text-[15.522px] text-center top-[-1.49px] whitespace-nowrap">T06</p>
      </div>
    </div>
  );
}

function P11() {
  return (
    <div className="h-[26.866px] relative shrink-0 w-[62.421px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[17.91px] left-[31.75px] not-italic text-[#9ca3af] text-[11.94px] text-center top-[1.49px] whitespace-nowrap">Blocked</p>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute bg-[rgba(107,114,128,0.1)] content-stretch flex flex-col gap-[3.582px] h-[161.194px] items-center justify-center left-[410.67px] p-[2.388px] rounded-[9.552px] top-[374.1px] w-[125.373px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#9ca3af] border-[2.388px] border-solid inset-0 pointer-events-none rounded-[9.552px]" />
      <P10 />
      <P11 />
    </div>
  );
}

function Span3() {
  return (
    <div className="bg-white h-[42.985px] relative rounded-[4.776px] shrink-0 w-[204.081px]" data-name="span">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-[1.194px] border-solid inset-0 pointer-events-none rounded-[4.776px] shadow-[0px_1.194px_3.582px_0px_rgba(0,0,0,0.08)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[13.134px] py-[3.582px] relative size-full">
        <p className="font-['Lato:SemiBold',sans-serif] leading-[21.493px] not-italic relative shrink-0 text-[#282828] text-[14.328px] whitespace-nowrap">Main Dining Area</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex h-[85.97px] items-start left-0 pl-[14.328px] pt-[14.328px] rounded-tl-[7.164px] rounded-tr-[7.164px] top-[61px] w-[895.522px]" data-name="Container">
      <Span3 />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[800px] relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <Frame1 />
      <Container11 />
      <Button6 />
      <Button7 />
      <Button8 />
      <Button9 />
      <Button10 />
      <Button11 />
      <Container12 />
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-white flex-[1_0_0] h-[848px] min-h-px min-w-px relative" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pt-[24px] px-[24px] relative size-full">
          <Container7 />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative w-full">
        <Container5 />
        <Container6 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative w-[1369px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <Frame />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1369px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container4 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[913px] items-start left-0 overflow-clip top-[72px] w-[1369px]" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Container14() {
  return <div className="absolute h-0 left-[420px] top-[35.5px] w-[738px]" data-name="Container" />;
}

function Group() {
  return (
    <div className="absolute inset-[8.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px_-1.5px] mask-size-[18px_18px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
          <g id="Group">
            <path d={svgPaths.p2abc0418} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p1e2ca080} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2181a800} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M0.75 4.5H15.75" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p3d306c00} id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="svg">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <ClipPathGroup />
      </div>
    </div>
  );
}

function Span4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[51.891px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[24px] left-[26px] not-italic text-[16px] text-center text-white top-0 whitespace-nowrap">Service</p>
      </div>
    </div>
  );
}

function Div6() {
  return (
    <div className="bg-[#006bff] flex-[1_0_0] h-[48px] min-h-px min-w-px relative rounded-[12px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center relative size-full">
        <Svg />
        <Span4 />
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="h-[64px] relative shrink-0 w-[160px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start pt-[8px] px-[4px] relative size-full">
        <Div6 />
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="svg">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="svg">
          <path d={svgPaths.p22c79200} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p173d700} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 8.25H12" id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 12H12" id="Vector_4" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6 8.25H6.0075" id="Vector_5" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6 12H6.0075" id="Vector_6" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Span5() {
  return (
    <div className="h-[24px] relative shrink-0 w-[41.398px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[24px] left-[21px] not-italic text-[#282828] text-[16px] text-center top-0 whitespace-nowrap">Order</p>
      </div>
    </div>
  );
}

function Div7() {
  return (
    <div className="bg-[#f4f4f4] flex-[1_0_0] h-[48px] min-h-px min-w-px relative rounded-[12px]" data-name="div">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center pr-[0.008px] relative size-full">
          <Svg1 />
          <Span5 />
        </div>
      </div>
    </div>
  );
}

function Button13() {
  return (
    <div className="h-[64px] relative shrink-0 w-[160px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start pt-[8px] px-[4px] relative size-full">
        <Div7 />
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="svg">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="svg">
          <path d={svgPaths.p1f7ee380} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p6466980} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 13.125V4.875" id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Span6() {
  return (
    <div className="h-[24px] relative shrink-0 w-[80.641px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[24px] left-[40.5px] not-italic text-[#282828] text-[16px] text-center top-0 whitespace-nowrap">Transaction</p>
      </div>
    </div>
  );
}

function Div8() {
  return (
    <div className="bg-[#f4f4f4] flex-[1_0_0] h-[48px] min-h-px min-w-px relative rounded-[12px]" data-name="div">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center relative size-full">
        <Svg2 />
        <Span6 />
      </div>
    </div>
  );
}

function Button14() {
  return (
    <div className="flex-[1_0_0] h-[64px] min-h-px min-w-px relative" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start pt-[8px] px-[4px] relative size-full">
        <Div8 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[72px] relative shrink-0 w-[480px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Button12 />
        <Button13 />
        <Button14 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex h-[71px] items-center justify-center left-0 top-0 w-[1369px]" data-name="Container">
      <Container16 />
    </div>
  );
}

function Img() {
  return (
    <div className="h-[21px] relative shrink-0 w-[120px]" data-name="img">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImg} />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex h-[71px] items-center left-0 pl-[24px] top-0 w-[420px]" data-name="Container">
      <Img />
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

function Span7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[65px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Medium',sans-serif] leading-[20px] left-[32px] not-italic text-[#282828] text-[14px] text-center top-[0.5px] whitespace-nowrap">Close POS</p>
      </div>
    </div>
  );
}

function Button15() {
  return (
    <div className="bg-white h-[48px] relative rounded-[12px] shrink-0 w-[123px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center p-px relative size-full">
        <DoorClosed />
        <Span7 />
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

function Button16() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 size-[48px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Menu />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[48px] items-center left-[1158px] top-[11.5px] w-[211px]" data-name="Container">
      <Button15 />
      <Button16 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-white border-[#e9e9e9] border-b border-solid h-[72px] left-0 top-0 w-[1369px]" data-name="Container">
      <Container14 />
      <Container15 />
      <Container17 />
      <Container18 />
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] h-[985px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Container1 />
        <Container13 />
      </div>
    </div>
  );
}

function Div() {
  return (
    <div className="absolute bg-white content-stretch flex h-[985px] items-start left-0 top-0 w-[1369px]" data-name="div">
      <Container />
    </div>
  );
}

function Div9() {
  return <div className="absolute left-[684.5px] size-0 top-[961px]" data-name="div" />;
}

export default function RmsTabletChangeLayout() {
  return (
    <div className="bg-white relative size-full" data-name="RMS Tablet - Change layout">
      <Div />
      <Div9 />
    </div>
  );
}