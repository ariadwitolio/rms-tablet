function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[26px] items-start justify-center left-[24px] top-[20px] w-[19.422px]" data-name="Container">
      <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[#282828] text-[16px] text-center tracking-[0.1238px] whitespace-nowrap">Ground Floor</p>
    </div>
  );
}

function Container3() {
  return <div className="absolute bg-[#006bff] h-[65px] left-0 top-0 w-[6px]" data-name="Container" />;
}

function Container1() {
  return (
    <div className="absolute h-[66px] left-0 top-[-0.5px] w-[159px]" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Div1() {
  return (
    <div className="h-[65px] relative shrink-0 w-full" data-name="div">
      <Container1 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#e9f9f8] content-stretch flex flex-col h-[66px] items-start left-0 pb-px top-0 w-[159px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#d4d4d4] border-b border-solid inset-0 pointer-events-none" />
      <Div1 />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col h-[26px] items-start justify-center left-[24px] top-[20px] w-[77.719px]" data-name="Container">
      <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[#535353] text-[16px] text-center tracking-[0.1238px] whitespace-nowrap">Mezzanine</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute h-[66px] left-0 top-0 w-[159px]" data-name="Container">
      <Container5 />
    </div>
  );
}

function Div2() {
  return (
    <div className="h-[66px] relative shrink-0 w-full" data-name="div">
      <Container4 />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[#fff4e6] content-stretch flex flex-col h-[67px] items-start left-0 pb-px top-[66px] w-[159px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#d4d4d4] border-b border-solid inset-0 pointer-events-none" />
      <Div2 />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col h-[26px] items-start justify-center left-[24px] top-[20px] w-[91.523px]" data-name="Container">
      <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[#535353] text-[16px] text-center tracking-[0.1238px] whitespace-nowrap">Rooftop</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[66px] left-0 top-0 w-[159px]" data-name="Container">
      <Container7 />
    </div>
  );
}

function Div3() {
  return (
    <div className="h-[66px] relative shrink-0 w-full" data-name="div">
      <Container6 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-[#f2eaf7] content-stretch flex flex-col h-[67px] items-start left-0 pb-px top-[133px] w-[159px]" data-name="button">
      <div aria-hidden="true" className="absolute border-[#d4d4d4] border-b border-solid inset-0 pointer-events-none" />
      <Div3 />
    </div>
  );
}

function Div() {
  return (
    <div className="h-[334px] relative shrink-0 w-full" data-name="div">
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}

function ScrollAreaPrimitiveViewport() {
  return (
    <div className="content-stretch flex flex-col h-[724px] items-start overflow-clip relative shrink-0 w-full" data-name="ScrollAreaPrimitive.Viewport">
      <Div />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start pr-px relative size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-r border-solid inset-0 pointer-events-none" />
      <ScrollAreaPrimitiveViewport />
    </div>
  );
}