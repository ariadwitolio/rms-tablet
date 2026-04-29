import svgPaths from "./svg-ctu2kescr5";
import imgLabamuLogo from "figma:asset/19869fce8ee021dc83a73d48a4918a17d356f441.png";

function Frame() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
        <div className="bg-[#e6f0ff] content-stretch flex gap-[10px] h-[44px] items-center justify-center px-[24px] py-[8px] relative rounded-[80px] shrink-0" data-name="Chips">
          <div aria-hidden="true" className="absolute border border-[#006bff] border-solid inset-0 pointer-events-none rounded-[80px]" />
          <p className="font-['Lato:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#006bff] text-[14px] text-center tracking-[0.0962px] whitespace-nowrap">Dine-In</p>
        </div>
        <div className="bg-white content-stretch flex gap-[10px] h-[44px] items-center justify-center px-[24px] py-[8px] relative rounded-[80px] shrink-0" data-name="Chips">
          <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[80px]" />
          <p className="font-['Lato:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#7e7e7e] text-[14px] text-center tracking-[0.0962px] whitespace-nowrap">Takeaway</p>
        </div>
        <div className="bg-white content-stretch flex gap-[10px] h-[44px] items-center justify-center px-[24px] py-[8px] relative rounded-[80px] shrink-0" data-name="Chips">
          <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[80px]" />
          <p className="font-['Lato:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#7e7e7e] text-[14px] text-center tracking-[0.0962px] whitespace-nowrap">Delivery</p>
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-white h-[69px] relative shrink-0 w-[1369px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-px pl-[20px] relative size-full">
        <Frame />
      </div>
    </div>
  );
}

function Div2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[26px] items-start justify-center left-[24px] top-[20px] w-[119px]" data-name="div">
      <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[#006bff] text-[16px] tracking-[0.1238px] whitespace-nowrap">Ground Floor</p>
    </div>
  );
}

function Div3() {
  return <div className="absolute bg-[#006bff] h-[66px] left-0 top-0 w-[6px]" data-name="div" />;
}

function Button() {
  return (
    <div className="absolute border-[#e9e9e9] border-b border-solid h-[67px] left-0 top-0 w-[159px]" data-name="button">
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

function Button1() {
  return (
    <div className="absolute bg-white border-[#e9e9e9] border-b border-solid h-[67px] left-0 top-[67px] w-[159px]" data-name="button">
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

function Button2() {
  return (
    <div className="absolute bg-white border-[#e9e9e9] border-b border-solid h-[67px] left-0 top-[134px] w-[159px]" data-name="button">
      <Div5 />
    </div>
  );
}

function Div1() {
  return (
    <div className="h-[201px] relative shrink-0 w-full" data-name="div">
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}

function ScrollAreaPrimitiveViewport() {
  return (
    <div className="content-stretch flex flex-col h-[845px] items-start overflow-clip relative shrink-0 w-full" data-name="ScrollAreaPrimitive.Viewport">
      <Div1 />
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-white h-[845px] relative shrink-0 w-[160px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-px relative size-full">
        <ScrollAreaPrimitiveViewport />
      </div>
    </div>
  );
}

function Container8() {
  return <div className="absolute border-[#e9e9e9] border-[1.5px] border-solid h-[400px] left-[61px] rounded-[8px] top-[101px] w-[500px]" data-name="Container" />;
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_4008_980)" id="Icon">
          <path d={svgPaths.p2cd5ea80} id="Vector" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.16667 11.6667H2.91667" id="Vector_2" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7.58333 11.6667H12.8333" id="Vector_3" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.83333 7V7.00583" id="Vector_4" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3c4c0b80} id="Vector_5" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_4008_980">
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
    <div className="absolute bg-[rgba(0,107,255,0.1)] content-stretch flex gap-[6px] h-[40px] items-center left-[61px] pl-[10px] pr-[2px] py-[2px] rounded-[6px] top-[31px] w-[150px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#006bff] border-solid inset-0 pointer-events-none rounded-[6px]" />
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
          <path d={svgPaths.p124a2580} id="Vector" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p206e4880} id="Vector_2" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2237bd80} id="Vector_3" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
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
    <div className="absolute bg-[rgba(16,185,129,0.1)] content-stretch flex gap-[6px] h-[40px] items-center left-[231px] pl-[10px] pr-[2px] py-[2px] rounded-[6px] top-[31px] w-[110px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#10b981] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Icon1 />
      <Span1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p332d3b0} id="Vector" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M3.5 9.91667H10.5" id="Vector_2" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Span2() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[43.945px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[19.5px] left-0 not-italic text-[#282828] text-[13px] top-[-0.5px] whitespace-nowrap">Kitchen</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-[rgba(245,158,11,0.1)] content-stretch flex gap-[6px] h-[40px] items-center left-[81px] pl-[10px] pr-[2px] py-[2px] rounded-[6px] top-[541px] w-[110px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#f59e0b] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Icon2 />
      <Span2 />
    </div>
  );
}

function P() {
  return (
    <div className="h-[13px] relative shrink-0 w-[22.883px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[13px] left-[11.5px] not-italic text-[#282828] text-[13px] text-center top-[-0.5px] whitespace-nowrap">T01</p>
      </div>
    </div>
  );
}

function P1() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[26.313px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[16.5px] left-[13.5px] not-italic text-[#7e7e7e] text-[11px] text-center top-[-0.5px] whitespace-nowrap">4 pax</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[#e8f5e9] content-stretch flex flex-col gap-[2px] items-center justify-center left-[93px] p-[2px] rounded-[8px] size-[90px] top-[133px]" data-name="button">
      <div aria-hidden="true" className="absolute border-2 border-[#2e7d32] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <P />
      <P1 />
    </div>
  );
}

function P2() {
  return (
    <div className="h-[13px] relative shrink-0 w-[22.883px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[13px] left-[11.5px] not-italic text-[#282828] text-[13px] text-center top-[-0.5px] whitespace-nowrap">T02</p>
      </div>
    </div>
  );
}

function P3() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[26.313px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[16.5px] left-[13.5px] not-italic text-[#7e7e7e] text-[11px] text-center top-[-0.5px] whitespace-nowrap">4 pax</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[#e8f5e9] content-stretch flex flex-col gap-[2px] items-center justify-center left-[213px] p-[2px] rounded-[8px] size-[90px] top-[133px]" data-name="button">
      <div aria-hidden="true" className="absolute border-2 border-[#2e7d32] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <P2 />
      <P3 />
    </div>
  );
}

function P4() {
  return (
    <div className="h-[13px] relative shrink-0 w-[22.883px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[13px] left-[11.5px] not-italic text-[#282828] text-[13px] text-center top-[-0.5px] whitespace-nowrap">T03</p>
      </div>
    </div>
  );
}

function P5() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[26.313px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[16.5px] left-[13.5px] not-italic text-[#7e7e7e] text-[11px] text-center top-[-0.5px] whitespace-nowrap">4 pax</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[#e8f5e9] content-stretch flex flex-col gap-[2px] items-center justify-center left-[333px] p-[2px] rounded-[8px] size-[90px] top-[133px]" data-name="button">
      <div aria-hidden="true" className="absolute border-2 border-[#2e7d32] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <P4 />
      <P5 />
    </div>
  );
}

function P6() {
  return (
    <div className="h-[16px] relative shrink-0 w-[28.164px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[16px] left-[14.5px] not-italic text-[#282828] text-[16px] text-center top-0 whitespace-nowrap">T04</p>
      </div>
    </div>
  );
}

function P7() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[26.313px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[16.5px] left-[13.5px] not-italic text-[#7e7e7e] text-[11px] text-center top-[-0.5px] whitespace-nowrap">6 pax</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-[#e8f5e9] content-stretch flex flex-col gap-[2px] items-center justify-center left-[93px] p-[2px] rounded-[55px] size-[110px] top-[263px]" data-name="button">
      <div aria-hidden="true" className="absolute border-2 border-[#2e7d32] border-solid inset-0 pointer-events-none rounded-[55px]" />
      <P6 />
      <P7 />
    </div>
  );
}

function P8() {
  return (
    <div className="h-[16px] relative shrink-0 w-[28.164px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[16px] left-[14.5px] not-italic text-[#282828] text-[16px] text-center top-0 whitespace-nowrap">T05</p>
      </div>
    </div>
  );
}

function P9() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[26.313px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[16.5px] left-[13.5px] not-italic text-[#7e7e7e] text-[11px] text-center top-[-0.5px] whitespace-nowrap">6 pax</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-[#e8f5e9] content-stretch flex flex-col gap-[2px] items-center justify-center left-[233px] p-[2px] rounded-[55px] size-[110px] top-[263px]" data-name="button">
      <div aria-hidden="true" className="absolute border-2 border-[#2e7d32] border-solid inset-0 pointer-events-none rounded-[55px]" />
      <P8 />
      <P9 />
    </div>
  );
}

function P10() {
  return (
    <div className="h-[13px] relative shrink-0 w-[22.883px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[13px] left-[11.5px] not-italic text-[#7e7e7e] text-[13px] text-center top-[-0.5px] whitespace-nowrap">T06</p>
      </div>
    </div>
  );
}

function P11() {
  return (
    <div className="h-[15px] relative shrink-0 w-[34.852px]" data-name="p">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[15px] left-[17.5px] not-italic text-[#9ca3af] text-[10px] text-center top-[0.5px] whitespace-nowrap">Blocked</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute bg-[rgba(107,114,128,0.1)] content-stretch flex flex-col gap-[2px] h-[90px] items-center justify-center left-[393px] p-[2px] rounded-[8px] top-[268px] w-[70px]" data-name="button">
      <div aria-hidden="true" className="absolute border-2 border-[#9ca3af] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <P10 />
      <P11 />
    </div>
  );
}

function Span3() {
  return (
    <div className="bg-white h-[24px] relative rounded-[4px] shrink-0 w-[113.945px]" data-name="span">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[11px] py-[3px] relative size-full">
        <p className="font-['Lato:SemiBold',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#282828] text-[12px] whitespace-nowrap">Main Dining Area</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-start left-[61px] pb-px pl-[8px] pt-[8px] rounded-tl-[6px] rounded-tr-[6px] top-[101px] w-[500px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid inset-0 pointer-events-none rounded-tl-[6px] rounded-tr-[6px]" />
      <Span3 />
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-white h-[600px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)]" />
      <Container8 />
      <Container9 />
      <Container10 />
      <Container11 />
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
      <Button8 />
      <Container12 />
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-white flex-[1_0_0] h-[845px] min-h-px min-w-px relative" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[16px] pr-[293px] pt-[16px] relative size-full">
          <Container7 />
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative w-[1369px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <Container5 />
        <Container6 />
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
    <div className="absolute content-stretch flex flex-col h-[914px] items-start left-0 overflow-clip top-[72px] w-[1369px]" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-[43px] relative shrink-0 w-[187px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center px-[20px] relative size-full">
        <div className="h-[21px] relative shrink-0 w-[120px]" data-name="Labamu Logo">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLabamuLogo} />
        </div>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_4008_926)" id="Icon">
          <path d={svgPaths.p3af0d580} id="Vector" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3514ce64} id="Vector_2" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.pbe0900} id="Vector_3" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 5.25H16.5" id="Vector_4" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3d952b80} id="Vector_5" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_4008_926">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Span4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[51.891px]" data-name="span">
      <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[24px] left-[26px] not-italic text-[#006bff] text-[16px] text-center top-0 whitespace-nowrap">Service</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#f3f7fe] content-stretch flex gap-[8px] h-[71px] items-center justify-center p-[24px] relative shrink-0 w-[180px]">
      <Icon3 />
      <Span4 />
    </div>
  );
}

function Icon4() {
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

function Span5() {
  return (
    <div className="h-[24px] relative shrink-0 w-[51.891px]" data-name="span">
      <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[24px] left-[21px] not-italic text-[#282828] text-[16px] text-center top-0 whitespace-nowrap">Order</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] h-[71px] items-center justify-center p-[24px] relative shrink-0 w-[180px]">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-r border-solid inset-0 pointer-events-none" />
      <Icon4 />
      <Span5 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1f0b6880} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p121a8900} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 9H10.5" id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Span6() {
  return (
    <div className="h-[24px] relative shrink-0 w-[80.641px]" data-name="span">
      <p className="-translate-x-1/2 absolute font-['Lato:Regular',sans-serif] leading-[24px] left-[40.5px] not-italic text-[#282828] text-[16px] text-center top-0 whitespace-nowrap">Transaction</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Icon5 />
      <Span6 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-white content-stretch flex h-[71px] items-center justify-center p-[24px] relative shrink-0 w-[180px]">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-r border-solid inset-0 pointer-events-none" />
      <Frame6 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative w-full">
        <Frame1 />
        <Frame3 />
        <Frame4 />
      </div>
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

function Button9() {
  return (
    <div className="bg-white flex-[1_0_0] h-[48px] min-h-px min-w-px relative rounded-[12px]" data-name="Button">
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

function Button10() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 size-[48px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Menu />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[48px] relative shrink-0 w-[187px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button9 />
        <Button10 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-white content-stretch flex h-[72px] items-center justify-between left-0 pb-px pr-[24px] top-0 w-[1369px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid inset-0 pointer-events-none" />
      <Frame5 />
      <Frame2 />
      <Container14 />
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] h-[986px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Container1 />
        <Container13 />
      </div>
    </div>
  );
}

function Div() {
  return (
    <div className="absolute bg-white content-stretch flex h-[986px] items-start left-0 top-0 w-[1369px]" data-name="div">
      <Container />
    </div>
  );
}

function Div6() {
  return <div className="absolute left-[684.5px] size-0 top-[962px]" data-name="div" />;
}

export default function RmsTabletChangeLayout() {
  return (
    <div className="bg-white relative size-full" data-name="RMS Tablet - Change layout">
      <Div />
      <Div6 />
    </div>
  );
}