export default function TabDesktop() {
  return (
    <div className="bg-white content-stretch flex items-start relative rounded-tl-[12px] rounded-tr-[12px] size-full" data-name="Tab Desktop">
      <div aria-hidden="true" className="absolute border-[#f5f5f7] border-b border-solid inset-0 pointer-events-none rounded-tl-[12px] rounded-tr-[12px]" />
      <div className="content-stretch flex items-start px-[20px] py-[12px] relative rounded-tl-[12px] shrink-0" data-name="Tab Active">
        <div aria-hidden="true" className="absolute border-[#006bff] border-b-2 border-solid inset-0 pointer-events-none rounded-tl-[12px]" />
        <p className="font-['Lato:Bold',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#006bff] text-[16px] tracking-[0.11px] whitespace-nowrap">Tab</p>
      </div>
      <div className="content-stretch flex h-[46px] items-start px-[20px] py-[12px] relative shrink-0" data-name="Tab Active">
        <div aria-hidden="true" className="absolute border-[#d4d4d4] border-b-2 border-solid inset-0 pointer-events-none" />
        <p className="font-['Lato:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#a9a9a9] text-[16px] tracking-[0.11px] whitespace-nowrap">Tab</p>
      </div>
      <div className="content-stretch flex h-[46px] items-start px-[20px] py-[12px] relative shrink-0" data-name="Tab Active">
        <div aria-hidden="true" className="absolute border-[#d4d4d4] border-b-2 border-solid inset-0 pointer-events-none" />
        <p className="font-['Lato:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#a9a9a9] text-[16px] tracking-[0.11px] whitespace-nowrap">Tab</p>
      </div>
    </div>
  );
}