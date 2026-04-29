function Text() {
  return (
    <div className="absolute h-[18px] left-0 top-0 w-[84.984px]" data-name="Text">
      <p className="absolute font-['Lato:Bold',sans-serif] leading-[18px] left-0 not-italic text-[#7e7e7e] text-[12px] top-[-0.5px]">Split in progress (2)</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[18px] relative shrink-0 w-[88.086px]" data-name="Text">
      <p className="absolute font-['Lato:Bold',sans-serif] leading-[18px] left-0 not-italic text-[#54a73f] text-[12px] top-[-0.5px]">Paid Rp 149.500</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[18px] relative shrink-0 w-[131.305px]" data-name="Text">
      <p className="absolute font-['Lato:Bold',sans-serif] leading-[18px] left-0 not-italic text-[#d0021b] text-[12px] top-[-0.5px]">Outstanding Rp 396.750</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-0 top-[26px]">
      <Text1 />
      <div className="flex h-[12.739px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[12.739px]">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.7395 1">
                <line id="Line 1" stroke="var(--stroke-0, #E9E9E9)" x2="12.7395" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Text2 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[44px] relative shrink-0 w-[372.336px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text />
        <Frame />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[32px] relative rounded-[12px] shrink-0 w-[68.07px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[13px] py-px relative size-full">
        <p className="font-['Lato:Medium',sans-serif] leading-[17.143px] not-italic relative shrink-0 text-[#282828] text-[12px] text-center">Manage</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Button />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-[#f4f4f4] content-stretch flex flex-col items-start pt-[13px] px-[24px] relative size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-solid border-t inset-0 pointer-events-none" />
      <Container1 />
    </div>
  );
}