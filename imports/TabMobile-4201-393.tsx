export default function TabMobile() {
  return (
    <div className="bg-[#e9e9e9] content-stretch flex gap-[4px] items-start p-[4px] relative rounded-[8px] size-full" data-name="Tab Mobile">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <div className="bg-white content-stretch flex h-[56px] items-center justify-center p-[10px] relative rounded-[5px] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.12)] shrink-0 w-[160px]" data-name="Component 1">
        <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[#006bff] text-[18px] text-center tracking-[0.1238px] whitespace-nowrap">Tab 1</p>
      </div>
      <div className="bg-[#f4f4f4] content-stretch flex h-[56px] items-center justify-center p-[10px] relative rounded-[5px] shrink-0 w-[160px]" data-name="Component 1">
        <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[#282828] text-[18px] text-center tracking-[0.1238px] whitespace-nowrap">Tab 2</p>
      </div>
      <div className="bg-[#f4f4f4] content-stretch flex h-[56px] items-center justify-center p-[10px] relative rounded-[5px] shrink-0 w-[160px]" data-name="Component 1">
        <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[#282828] text-[18px] text-center tracking-[0.1238px] whitespace-nowrap">Tab 3</p>
      </div>
    </div>
  );
}