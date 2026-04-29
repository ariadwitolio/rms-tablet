import svgPaths from "./svg-prdw7rybrr";
import imgImageLabamu from "figma:asset/19869fce8ee021dc83a73d48a4918a17d356f441.png";
import { imgVector } from "./svg-a9ac3";

function TextInput() {
  return (
    <div className="absolute content-stretch flex h-[22px] items-center left-[32px] overflow-clip top-px w-[753.398px]" data-name="Text Input">
      <p className="font-['Lato:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#a9a9a9] text-[16px] tracking-[0.11px] whitespace-nowrap">Search menu items...</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[3.37%_3.36%_3.36%_3.37%]" data-name="Group">
      <div className="absolute inset-[3.37%_27.05%_27.05%_3.37%]" data-name="Vector">
        <div className="absolute inset-[-4.84%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5946 13.5999">
            <path d={svgPaths.p9739ea0} id="Vector" stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.19976" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[72.33%_3.37%_3.37%_72.28%]" data-name="Vector">
        <div className="absolute inset-[-13.85%_-13.83%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.53736 5.52991">
            <path d={svgPaths.p30c69000} id="Vector" stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.19976" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[17.82px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group />
    </div>
  );
}

function SearchIconGroup() {
  return (
    <div className="absolute content-stretch flex flex-col h-[17.82px] items-start left-[3.13px] top-[3.11px] w-[17.813px]" data-name="SearchIconGroup">
      <Icon />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[24px] left-[10px] top-[10px] w-[785.398px]" data-name="Container">
      <TextInput />
      <SearchIconGroup />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute h-[44px] left-0 top-0 w-[805.398px]" data-name="Container">
      <Container8 />
    </div>
  );
}

function InteractiveSearchBar() {
  return (
    <div className="bg-[#f4f4f4] flex-[1_0_0] h-[44px] min-h-px min-w-px relative rounded-[8px]" data-name="InteractiveSearchBar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container7 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="flex-[805.398_0_0] h-[44px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <InteractiveSearchBar />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-white h-[61px] relative shrink-0 w-[821.398px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start pb-px pt-[8px] px-[8px] relative size-full">
        <Container6 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex flex-col h-[26px] items-start justify-center left-[24px] top-[20px] w-[22.914px]" data-name="Container">
      <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[18px] text-center text-white tracking-[0.1238px] whitespace-nowrap">All</p>
    </div>
  );
}

function Container14() {
  return <div className="absolute bg-white h-[54px] left-[4px] rounded-br-[3px] rounded-tr-[3px] top-[6px] w-[4px]" data-name="Container" />;
}

function Container12() {
  return (
    <div className="absolute h-[66px] left-0 top-[-0.5px] w-[159px]" data-name="Container">
      <Container13 />
      <Container14 />
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[65px] relative shrink-0 w-full" data-name="Container">
      <Container12 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#1d4ed8] content-stretch flex flex-col h-[66px] items-start left-0 pb-px top-0 w-[159px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#d4d4d4] border-b border-solid inset-0 pointer-events-none" />
      <Container11 />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col h-[26px] items-start justify-center left-[24px] top-[20px] w-[89.133px]" data-name="Container">
      <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[18px] text-center text-white tracking-[0.1238px] whitespace-nowrap">Appetizers</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute h-[66px] left-0 top-0 w-[159px]" data-name="Container">
      <Container17 />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[66px] relative shrink-0 w-full" data-name="Container">
      <Container16 />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[#f97316] content-stretch flex flex-col h-[67px] items-start left-0 pb-px top-[66px] w-[159px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#d4d4d4] border-b border-solid inset-0 pointer-events-none" />
      <Container15 />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex flex-col h-[26px] items-start justify-center left-[24px] top-[20px] w-[103.492px]" data-name="Container">
      <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[18px] text-center text-white tracking-[0.1238px] whitespace-nowrap">Main Course</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute h-[66px] left-0 top-0 w-[159px]" data-name="Container">
      <Container20 />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[66px] relative shrink-0 w-full" data-name="Container">
      <Container19 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-[#8b5cf6] content-stretch flex flex-col h-[67px] items-start left-0 pb-px top-[133px] w-[159px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#d4d4d4] border-b border-solid inset-0 pointer-events-none" />
      <Container18 />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex flex-col h-[26px] items-start justify-center left-[24px] top-[20px] w-[71.609px]" data-name="Container">
      <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[18px] text-center text-white tracking-[0.1238px] whitespace-nowrap">Desserts</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute h-[66px] left-0 top-0 w-[159px]" data-name="Container">
      <Container23 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[66px] relative shrink-0 w-full" data-name="Container">
      <Container22 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[#14b8a6] content-stretch flex flex-col h-[67px] items-start left-0 pb-px top-[200px] w-[159px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#d4d4d4] border-b border-solid inset-0 pointer-events-none" />
      <Container21 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col h-[26px] items-start justify-center left-[24px] top-[20px] w-[84.414px]" data-name="Container">
      <p className="font-['Lato:Bold',sans-serif] leading-[26px] not-italic relative shrink-0 text-[18px] text-center text-white tracking-[0.1238px] whitespace-nowrap">Beverages</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute h-[66px] left-0 top-0 w-[159px]" data-name="Container">
      <Container26 />
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[66px] relative shrink-0 w-full" data-name="Container">
      <Container25 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[#ef4444] content-stretch flex flex-col h-[67px] items-start left-0 pb-px top-[267px] w-[159px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#d4d4d4] border-b border-solid inset-0 pointer-events-none" />
      <Container24 />
    </div>
  );
}

function OperationalOrderScreenContent1() {
  return (
    <div className="h-[334px] relative shrink-0 w-full" data-name="OperationalOrderScreenContent">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[853px] items-start overflow-clip relative shrink-0 w-full" data-name="Primitive.div">
      <OperationalOrderScreenContent1 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#e9e9e9]" />
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-white h-[853px] relative shrink-0 w-[160px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-px relative size-full">
        <PrimitiveDiv />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.797px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Caesar Salad</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[#f97316] content-stretch flex flex-col h-[96px] items-start justify-center left-[8px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[8px] w-[210px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading1 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute h-[30px] left-[20px] overflow-clip top-[31px] w-[165.797px]" data-name="Heading 3">
      <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Bruschetta</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[169.8px] rounded-[16777200px] size-[32px] top-[4px]" data-name="Container">
      <p className="font-['Lato:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#006bff] text-[16px] whitespace-nowrap">1</p>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-[#f97316] border-2 border-[#006bff] border-solid h-[96px] left-[225.8px] rounded-[12px] top-[8px] w-[210px]" data-name="Button">
      <Heading2 />
      <Container28 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.805px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Soup of the Day</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-[#f97316] content-stretch flex flex-col h-[96px] items-start justify-center left-[443.59px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[8px] w-[209.805px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading3 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.797px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Calamari</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute bg-[#f97316] content-stretch flex flex-col h-[96px] items-start justify-center left-[8px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[112px] w-[209.797px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading4 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.797px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Wagyu Steak</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute bg-[#8b5cf6] content-stretch flex flex-col h-[96px] items-start justify-center left-[225.8px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[112px] w-[210px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading5 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.805px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Grilled Salmon</p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute bg-[#8b5cf6] content-stretch flex flex-col h-[96px] items-start justify-center left-[443.59px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[112px] w-[210px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading6 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.797px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Pan-fried Chicken Cordon Bleu with Tartar Sauce</p>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute bg-[#8b5cf6] content-stretch flex flex-col h-[96px] items-start justify-center left-[8px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[216px] w-[209.797px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading7 />
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.797px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Pasta Carbonara</p>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute bg-[#8b5cf6] content-stretch flex flex-col h-[96px] items-start justify-center left-[225.8px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[216px] w-[210px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading8 />
    </div>
  );
}

function Heading9() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.805px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Lobster Thermidor</p>
      </div>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute bg-[#8b5cf6] content-stretch flex flex-col h-[96px] items-start justify-center left-[443.59px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[216px] w-[210px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading9 />
    </div>
  );
}

function Heading10() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.797px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Lamb Rack</p>
      </div>
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute bg-[#8b5cf6] content-stretch flex flex-col h-[96px] items-start justify-center left-[8px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[320px] w-[209.797px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading10 />
    </div>
  );
}

function Heading11() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.797px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Tiramisu</p>
      </div>
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute bg-[#14b8a6] content-stretch flex flex-col h-[96px] items-start justify-center left-[225.8px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[320px] w-[210px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading11 />
    </div>
  );
}

function Heading12() {
  return (
    <div className="absolute h-[30px] left-[20px] overflow-clip top-[31px] w-[165.805px]" data-name="Heading 3">
      <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Crème Brûlée</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[169.8px] rounded-[16777200px] size-[32px] top-[4px]" data-name="Container">
      <p className="font-['Lato:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#006bff] text-[16px] whitespace-nowrap">1</p>
    </div>
  );
}

function Button16() {
  return (
    <div className="absolute bg-[#14b8a6] border-2 border-[#006bff] border-solid h-[96px] left-[443.59px] rounded-[12px] top-[320px] w-[210px]" data-name="Button">
      <Heading12 />
      <Container29 />
    </div>
  );
}

function Heading13() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.797px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Chocolate Lava Cake</p>
      </div>
    </div>
  );
}

function Button17() {
  return (
    <div className="absolute bg-[#14b8a6] content-stretch flex flex-col h-[96px] items-start justify-center left-[8px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[424px] w-[209.797px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading13 />
    </div>
  );
}

function Heading14() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.797px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Panna Cotta</p>
      </div>
    </div>
  );
}

function Button18() {
  return (
    <div className="absolute bg-[#14b8a6] content-stretch flex flex-col h-[96px] items-start justify-center left-[225.8px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[424px] w-[210px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading14 />
    </div>
  );
}

function Heading15() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.805px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Espresso</p>
      </div>
    </div>
  );
}

function Button19() {
  return (
    <div className="absolute bg-[#ef4444] content-stretch flex flex-col h-[96px] items-start justify-center left-[443.59px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[424px] w-[210px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading15 />
    </div>
  );
}

function Heading16() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.797px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Cappuccino</p>
      </div>
    </div>
  );
}

function Button20() {
  return (
    <div className="absolute bg-[#ef4444] content-stretch flex flex-col h-[96px] items-start justify-center left-[8px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[528px] w-[209.797px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading16 />
    </div>
  );
}

function Heading17() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.797px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Fresh Orange Juice</p>
      </div>
    </div>
  );
}

function Button21() {
  return (
    <div className="absolute bg-[#ef4444] content-stretch flex flex-col h-[96px] items-start justify-center left-[225.8px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[528px] w-[210px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading17 />
    </div>
  );
}

function Heading18() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.805px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Mineral Water</p>
      </div>
    </div>
  );
}

function Button22() {
  return (
    <div className="absolute bg-[#ef4444] content-stretch flex flex-col h-[96px] items-start justify-center left-[443.59px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[528px] w-[210px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading18 />
    </div>
  );
}

function Heading19() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.797px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Wine (Glass)</p>
      </div>
    </div>
  );
}

function Button23() {
  return (
    <div className="absolute bg-[#ef4444] content-stretch flex flex-col h-[96px] items-start justify-center left-[8px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[632px] w-[209.797px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading19 />
    </div>
  );
}

function Heading20() {
  return (
    <div className="h-[30px] relative shrink-0 w-[167.797px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-white top-0 whitespace-nowrap">Signature Mocktail</p>
      </div>
    </div>
  );
}

function Button24() {
  return (
    <div className="absolute bg-[#ef4444] content-stretch flex flex-col h-[96px] items-start justify-center left-[225.8px] pl-[21px] pr-px py-[33px] rounded-[12px] top-[632px] w-[210px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Heading20 />
    </div>
  );
}

function OperationalOrderScreenContent2() {
  return (
    <div className="bg-[#f4f4f4] h-[928px] relative shrink-0 w-full" data-name="OperationalOrderScreenContent">
      <Button5 />
      <Button6 />
      <Button7 />
      <Button8 />
      <Button9 />
      <Button10 />
      <Button11 />
      <Button12 />
      <Button13 />
      <Button14 />
      <Button15 />
      <Button16 />
      <Button17 />
      <Button18 />
      <Button19 />
      <Button20 />
      <Button21 />
      <Button22 />
      <Button23 />
      <Button24 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#d4d4d4]" />
    </div>
  );
}

function PrimitiveDiv1() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[853px] items-start overflow-clip relative shrink-0 w-full" data-name="Primitive.div">
      <OperationalOrderScreenContent2 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#e9e9e9]" />
    </div>
  );
}

function Container27() {
  return (
    <div className="flex-[661.398_0_0] h-[853px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <PrimitiveDiv1 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="flex-[853_0_0] min-h-px min-w-px relative w-[821.398px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <Container10 />
        <Container27 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[914px] relative shrink-0 w-[821.398px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container5 />
        <Container9 />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[24px] left-0 top-px w-[77.766px]" data-name="Paragraph">
      <p className="absolute font-['Lato:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#282828] text-[18px] top-0 whitespace-nowrap">Table T02</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[80.367px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[21px] left-0 not-italic text-[#a65f00] text-[14px] top-0 whitespace-nowrap">Partially Paid</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute bg-[#fef9c2] content-stretch flex h-[26px] items-center justify-center left-[85.77px] px-[11px] py-px rounded-[12px] top-0 w-[102.367px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#ffdf20] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Paragraph1 />
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[26px] relative shrink-0 w-[188.133px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Paragraph />
        <Container34 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pr-[326.461px] relative size-full">
          <Container33 />
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p317fdd80} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p31c78b80} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3625bb80} id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2ca18b80} id="Vector_4" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[21px] left-0 not-italic text-[#282828] text-[14px] top-0 whitespace-nowrap">3 pax</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[21px] items-center left-0 top-0 w-[53.703px]" data-name="Container">
      <Icon1 />
      <Paragraph2 />
    </div>
  );
}

function Container37() {
  return <div className="absolute bg-[#e9e9e9] h-[14px] left-[63.7px] top-[3.5px] w-px" data-name="Container" />;
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_4260_2209)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #7E7E7E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector_2" stroke="var(--stroke-0, #7E7E7E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_4260_2209">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#7e7e7e] text-[14px] top-0 whitespace-nowrap">Time Seated</p>
      </div>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[21px] relative shrink-0 w-[61.039px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[21px] left-0 not-italic text-[#282828] text-[14px] top-0 whitespace-nowrap">2m / 90m</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[21px] items-center left-[74.7px] top-0 w-[162.656px]" data-name="Container">
      <Icon2 />
      <Paragraph3 />
      <Paragraph4 />
    </div>
  );
}

function Container39() {
  return <div className="absolute bg-[#e9e9e9] h-[14px] left-[247.36px] top-[3.5px] w-px" data-name="Container" />;
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M7 0.583334V13.4167" id="Vector" stroke="var(--stroke-0, #7E7E7E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p231c2b00} id="Vector_2" stroke="var(--stroke-0, #7E7E7E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[21px] relative shrink-0 w-[56.813px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#7e7e7e] text-[14px] top-0 whitespace-nowrap">Purchase</p>
      </div>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[21px] left-0 not-italic text-[#282828] text-[14px] top-0 whitespace-nowrap">172.500 / 0</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[21px] items-center left-[258.36px] top-0 w-[156.375px]" data-name="Container">
      <Icon3 />
      <Paragraph5 />
      <Paragraph6 />
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <Container36 />
      <Container37 />
      <Container38 />
      <Container39 />
      <Container40 />
    </div>
  );
}

function Container31() {
  return (
    <div className="bg-white h-[80px] relative shrink-0 w-[546.594px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-px pt-[12px] px-[16px] relative size-full">
        <Container32 />
        <Container35 />
      </div>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[27px] left-0 overflow-clip top-0 w-[110.023px]" data-name="Paragraph">
      <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-0 not-italic text-[#282828] text-[18px] top-[0.5px] whitespace-nowrap">1x Bruschetta</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[390.594px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Paragraph7 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="flex-[390.594_0_0] h-[27px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container45 />
      </div>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="flex-[1_0_0] h-[27px] min-h-px min-w-px relative" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="-translate-x-full absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[112.7px] not-italic text-[#7e7e7e] text-[18px] text-right top-[0.5px] whitespace-nowrap">Rp 65,000</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[27px] relative shrink-0 w-[112px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Paragraph8 />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[27px] relative shrink-0 w-[112px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end justify-center relative size-full">
        <Container47 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="flex-[1_0_0] h-[44px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container44 />
        <Container46 />
      </div>
    </div>
  );
}

function DraggableItemCard() {
  return (
    <div className="bg-white h-[70px] relative shrink-0 w-full" data-name="DraggableItemCard">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start pb-px pt-[13px] px-[16px] relative size-full">
          <Container43 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="absolute h-[27px] left-0 overflow-clip top-0 w-[132.703px]" data-name="Paragraph">
      <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-0 not-italic text-[#282828] text-[18px] top-[0.5px] whitespace-nowrap">1x Crème Brûlée</p>
    </div>
  );
}

function Container50() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[390.594px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Paragraph9 />
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="flex-[390.594_0_0] h-[27px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container50 />
      </div>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="flex-[1_0_0] h-[27px] min-h-px min-w-px relative" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="-translate-x-full absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[112.7px] not-italic text-[#7e7e7e] text-[18px] text-right top-[0.5px] whitespace-nowrap">Rp 85,000</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="h-[27px] relative shrink-0 w-[112px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Paragraph10 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[27px] relative shrink-0 w-[112px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end justify-center relative size-full">
        <Container52 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="flex-[1_0_0] h-[44px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container49 />
        <Container51 />
      </div>
    </div>
  );
}

function DraggableItemCard1() {
  return (
    <div className="bg-white h-[70px] relative shrink-0 w-full" data-name="DraggableItemCard">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start pb-px pt-[13px] px-[16px] relative size-full">
          <Container48 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col h-[140px] items-start relative shrink-0 w-full" data-name="Container">
      <DraggableItemCard />
      <DraggableItemCard1 />
    </div>
  );
}

function Container41() {
  return (
    <div className="flex-[529_0_0] min-h-px min-w-px relative w-[546.594px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container42 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[21px] relative shrink-0 w-[50.891px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#7e7e7e] text-[14px] top-0 whitespace-nowrap">Tax (5%)</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[54.898px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#7e7e7e] text-[14px] top-0 whitespace-nowrap">Rp 7,500</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex h-[21px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text />
      <Text1 />
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[21px] relative shrink-0 w-[130.68px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#7e7e7e] text-[14px] top-0 whitespace-nowrap">Service Charge (10%)</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[21px] relative shrink-0 w-[63.016px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#7e7e7e] text-[14px] top-0 whitespace-nowrap">Rp 15,000</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex h-[21px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text2 />
      <Text3 />
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[27px] relative shrink-0 w-[93.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#282828] text-[18px] top-[0.5px] whitespace-nowrap">Grand Total</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[30px] relative shrink-0 w-[102.375px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[#006bff] text-[20px] top-0 whitespace-nowrap">Rp 172,500</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex h-[39px] items-center justify-between pt-px relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-solid border-t inset-0 pointer-events-none" />
      <Text4 />
      <Text5 />
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[97px] items-start relative shrink-0 w-full" data-name="Container">
      <Container55 />
      <Container56 />
      <Container57 />
    </div>
  );
}

function Container53() {
  return (
    <div className="bg-white h-[305px] relative shrink-0 w-[546.594px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[17px] px-[16px] relative size-full">
        <Container54 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="bg-white h-[914px] relative shrink-0 w-[547.594px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-l border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-px relative size-full">
        <Container31 />
        <Container41 />
        <Container53 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[914_0_0] min-h-px min-w-px relative w-[1369px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <Container4 />
        <Container30 />
      </div>
    </div>
  );
}

function OperationalOrderScreenContent() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative w-[1369px]" data-name="OperationalOrderScreenContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container3 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[914_0_0] min-h-px min-w-px relative w-[1369px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <OperationalOrderScreenContent />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[914px] items-start left-0 overflow-clip top-[72px] w-[1369px]" data-name="Container">
      <Container2 />
    </div>
  );
}

function ImageLabamu() {
  return (
    <div className="h-[21px] relative shrink-0 w-[120px]" data-name="Image (Labamu)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImageLabamu} />
    </div>
  );
}

function Container59() {
  return (
    <div className="absolute content-stretch flex h-[71px] items-center left-0 pl-[24px] top-0 w-[420px]" data-name="Container">
      <ImageLabamu />
    </div>
  );
}

function Container61() {
  return <div className="absolute border border-[#e9e9e9] border-solid h-[59px] left-[-0.5px] rounded-[12px] top-[-0.5px] w-[437px]" data-name="Container" />;
}

function Group1() {
  return (
    <div className="absolute contents inset-[8.33%]" data-name="Group">
      <div className="absolute inset-[8.33%_8.33%_70.83%_8.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px_-1.5px] mask-size-[18px_18px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-20%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 5.25">
            <path d={svgPaths.p2abc0418} id="Vector" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-[16.67%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3px_-9px] mask-size-[18px_18px] right-[16.67%] top-1/2" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-10%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 9">
            <path d={svgPaths.pa554c90} id="Vector" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[66.67%_37.5%_8.33%_37.5%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6.75px_-12px] mask-size-[18px_18px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d={svgPaths.p1f47cad0} id="Vector" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_8.33%_70.83%_8.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px_-5.25px] mask-size-[18px_18px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-0.75px_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 1.5">
            <path d="M0.75 0.75H15.75" id="Vector" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[8.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.5px_-5.25px] mask-size-[18px_18px] right-[8.33%] top-[29.17%]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-20%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 5.25">
            <path d={svgPaths.p1c591380} id="Vector" stroke="var(--stroke-0, #006BFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function FohLayout1() {
  return (
    <div className="h-[18px] overflow-clip relative shrink-0 w-full" data-name="FOHLayout">
      <ClipPathGroup />
    </div>
  );
}

function Text6() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <FohLayout1 />
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[22px] relative shrink-0 w-[53.5px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[22px] left-[27.5px] not-italic text-[#006bff] text-[16px] text-center top-0 tracking-[0.11px] whitespace-nowrap">Service</p>
      </div>
    </div>
  );
}

function Button25() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[8px] h-[50px] items-center justify-center left-[4px] px-[30.25px] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.12)] top-[4px] w-[140px]" data-name="Button">
      <Text6 />
      <Text7 />
    </div>
  );
}

function FohLayout2() {
  return (
    <div className="h-[18px] overflow-clip relative shrink-0 w-full" data-name="FOHLayout">
      <div className="absolute bottom-3/4 left-[33.33%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.5 4.5">
            <path d={svgPaths.p2b757c00} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.67%_16.67%_8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5.56%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 15">
            <path d={svgPaths.pf0acb80} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[54.17%] left-1/2 right-[33.33%] top-[45.83%]" data-name="Vector">
        <div className="absolute inset-[-0.75px_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.5 1.5">
            <path d="M0.75 0.75H3.75" id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[33.33%] left-1/2 right-[33.33%] top-[66.67%]" data-name="Vector">
        <div className="absolute inset-[-0.75px_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.5 1.5">
            <path d="M0.75 0.75H3.75" id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[45.83%_66.62%_54.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.75px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.5075 1.5">
            <path d="M0.75 0.75H0.7575" id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[66.67%_66.62%_33.33%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.75px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.5075 1.5">
            <path d="M0.75 0.75H0.7575" id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <FohLayout2 />
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[22px] relative shrink-0 w-[44.094px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[22px] left-[22.5px] not-italic text-[#282828] text-[16px] text-center top-0 tracking-[0.11px] whitespace-nowrap">Order</p>
      </div>
    </div>
  );
}

function Button26() {
  return (
    <div className="absolute bg-[#f4f4f4] content-stretch flex gap-[8px] h-[50px] items-center justify-center left-[148px] px-[34.953px] rounded-[12px] top-[4px] w-[140px]" data-name="Button">
      <Text8 />
      <Text9 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[18px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-3.75%_-4.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 16.125">
            <path d={svgPaths.p2f973730} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.125" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-9.38%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.125 7.125">
            <path d={svgPaths.p5b65d80} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.125" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[27.08%] left-1/2 right-1/2 top-[27.08%]" data-name="Vector">
        <div className="absolute inset-[-6.82%_-0.56px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.125 9.375">
            <path d="M0.5625 8.8125V0.5625" id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.125" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[22px] relative shrink-0 w-[84.953px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[22px] left-[42px] not-italic text-[#282828] text-[16px] text-center top-0 tracking-[0.11px] whitespace-nowrap">Transaction</p>
      </div>
    </div>
  );
}

function Button27() {
  return (
    <div className="absolute bg-[#f4f4f4] content-stretch flex gap-[8px] h-[50px] items-center justify-center left-[292px] px-[14.523px] rounded-[12px] top-[4px] w-[140px]" data-name="Button">
      <Text10 />
      <Text11 />
    </div>
  );
}

function TabGroup() {
  return (
    <div className="absolute bg-[#e9e9e9] h-[58px] left-[466.5px] rounded-[12px] top-[6.5px] w-[436px]" data-name="TabGroup">
      <Container61 />
      <Button25 />
      <Button26 />
      <Button27 />
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute h-[71px] left-0 top-0 w-[1369px]" data-name="Container">
      <TabGroup />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[21.5px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3f02fd00} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 13.3333H14.6667" id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M9.33333 8V8.00667" id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MainBtn() {
  return (
    <div className="bg-[#e6f0ff] h-[56px] relative rounded-[12px] shrink-0 w-[152.797px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#b3d9ff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon5 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[89.5px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">Close POS</p>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M3.33333 10H16.6667" id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M3.33333 5H16.6667" id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M3.33333 15H16.6667" id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function MainBtn1() {
  return (
    <div className="bg-[#e6f0ff] h-[56px] relative rounded-[12px] shrink-0 w-[63px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#b3d9ff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[21.5px] py-[1.5px] relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[56px] items-center left-[1113.2px] top-[7.5px] w-[255.797px]" data-name="Container">
      <MainBtn />
      <MainBtn1 />
    </div>
  );
}

function Container58() {
  return (
    <div className="absolute bg-white border-[#e9e9e9] border-b border-solid h-[72px] left-0 top-0 w-[1369px]" data-name="Container">
      <Container59 />
      <Container60 />
      <Container62 />
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1369_0_0] h-[986px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Container1 />
        <Container58 />
      </div>
    </div>
  );
}

function FohLayout() {
  return (
    <div className="absolute bg-white content-stretch flex h-[986px] items-start left-0 overflow-clip top-0 w-[1369px]" data-name="FOHLayout">
      <Container />
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[58.4px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1c0c2e80} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2b95cc00} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MainBtn2() {
  return (
    <div className="bg-[#e6f0ff] flex-[211.664_0_0] h-[56px] min-h-px min-w-px relative rounded-[12px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#b3d9ff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon7 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[118.9px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">Trx Note</p>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[50.7px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32976d80} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p36381b80} id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1dc66e00} id="Vector_4" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p382e2b80} id="Vector_5" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p217a6a00} id="Vector_6" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p275fcf60} id="Vector_7" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.0667 12.4667L12.8 11.8" id="Vector_8" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M11.2 8.2L10.9333 7.53333" id="Vector_9" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M9.53333 11.0667L10.2 10.8" id="Vector_10" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.8 9.2L14.4667 8.93333" id="Vector_11" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MainBtn3() {
  return (
    <div className="bg-[#e6f0ff] flex-[211.664_0_0] h-[56px] min-h-px min-w-px relative rounded-[12px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#b3d9ff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon8 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[119.2px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">Guest/Pax</p>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[57.2px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2daf5240} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p156c3380} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pae95270} id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MainBtn4() {
  return (
    <div className="bg-[#e6f0ff] flex-[211.664_0_0] h-[56px] min-h-px min-w-px relative rounded-[12px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#b3d9ff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon9 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[119.2px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">Discount</p>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[43.43px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_4260_2140)" id="Icon">
          <path d={svgPaths.p3397ec80} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4adfe2c} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p27a74a00} id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_4260_2140">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MainBtn5() {
  return (
    <div className="bg-[#e6f0ff] flex-[211.664_0_0] h-[56px] min-h-px min-w-px relative rounded-[12px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#b3d9ff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon10 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[118.93px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">Reprint KOT</p>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[52.31px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_4260_2140)" id="Icon">
          <path d={svgPaths.p3397ec80} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4adfe2c} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p27a74a00} id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_4260_2140">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MainBtn6() {
  return (
    <div className="bg-[#f4f4f4] flex-[210.664_0_0] h-[56px] min-h-px min-w-px opacity-50 relative rounded-[12px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon11 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[118.81px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">Send Item</p>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute left-[46.27px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MainBtn7() {
  return (
    <div className="bg-[#e6f0ff] flex-[211.664_0_0] h-[56px] min-h-px min-w-px relative rounded-[12px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#b3d9ff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon12 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[119.27px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">Add Course</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[56px] relative shrink-0 w-[1329px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start pr-[0.016px] relative size-full">
        <MainBtn2 />
        <MainBtn3 />
        <MainBtn4 />
        <MainBtn5 />
        <MainBtn6 />
        <MainBtn7 />
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute left-[37.73px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pc57ea80} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 4.66667H2.66667" id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p30e94400} id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 11.3333H13.3333" id="Vector_4" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MainBtn8() {
  return (
    <div className="bg-[#e6f0ff] flex-[211.5_0_0] h-[56px] min-h-px min-w-px relative rounded-[12px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#b3d9ff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon13 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[119.23px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">Transfer Table</p>
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="absolute left-[44.13px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MainBtn9() {
  return (
    <div className="bg-[#e6f0ff] flex-[211.5_0_0] h-[56px] min-h-px min-w-px relative rounded-[12px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#b3d9ff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon14 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[119.13px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">Merge Table</p>
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute left-[8.27px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p185fb780} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p30ca5e80} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pac25b80} id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.72667 9.00667L10.28 11.66" id="Vector_4" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p533300} id="Vector_5" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MainBtn10() {
  return (
    <div className="bg-[#e6f0ff] flex-[211.5_0_0] h-[56px] min-h-px min-w-px relative rounded-[12px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#b3d9ff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon15 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[118.77px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">Transfer Item/Course</p>
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-[80.11px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_4260_2105)" id="Icon">
          <path d={svgPaths.p1a301180} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p136e980} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p31226900} id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3b8a3200} id="Vector_4" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2d525300} id="Vector_5" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_4260_2105">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MainBtn11() {
  return (
    <div className="bg-[#e6f0ff] flex-[211.5_0_0] h-[56px] min-h-px min-w-px relative rounded-[12px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#b3d9ff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon16 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[119.11px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">Tip</p>
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="absolute left-[58.88px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_4260_2140)" id="Icon">
          <path d={svgPaths.p3397ec80} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4adfe2c} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p27a74a00} id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_4260_2140">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MainBtn12() {
  return (
    <div className="bg-[#e6f0ff] flex-[211.5_0_0] h-[56px] min-h-px min-w-px relative rounded-[12px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#b3d9ff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon17 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[118.88px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">Print Bill</p>
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="absolute left-[57.77px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p35993080} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 6.66667H14.6667" id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MainBtn13() {
  return (
    <div className="bg-[#e6f0ff] flex-[211.5_0_0] h-[56px] min-h-px min-w-px relative rounded-[12px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#b3d9ff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon18 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[118.77px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">Payment</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1329px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start relative size-full">
        <MainBtn8 />
        <MainBtn9 />
        <MainBtn10 />
        <MainBtn11 />
        <MainBtn12 />
        <MainBtn13 />
      </div>
    </div>
  );
}

function OperationalOrderScreenContent3() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[12px] h-[166px] items-start left-0 pb-[20px] pl-[20px] pt-[22px] top-[820px] w-[1369px]" data-name="OperationalOrderScreenContent">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-solid border-t-2 inset-0 pointer-events-none" />
      <Container63 />
      <Container64 />
    </div>
  );
}

function PrimitiveDiv2() {
  return <div className="absolute bg-[rgba(0,0,0,0.5)] h-[986px] left-0 top-0 w-[1369px]" data-name="Primitive.div" />;
}

function Heading() {
  return (
    <div className="absolute h-[30px] left-0 top-px w-[79.422px]" data-name="Heading 2">
      <p className="absolute font-['Lato:Bold',sans-serif] leading-[30px] left-0 not-italic text-[#282828] text-[20px] top-0 whitespace-nowrap">Payment</p>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[24px] relative shrink-0 w-[68.773px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">Table T02</p>
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[24px] relative shrink-0 w-[4.281px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">·</p>
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">Bill #00001</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[24px] items-center left-[91.42px] top-[4px] w-[170.734px]" data-name="Container">
      <Text12 />
      <Text13 />
      <Text14 />
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[20px] relative shrink-0 w-[91.844px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Lato:SemiBold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#a65f00] text-[16px] whitespace-nowrap">Partially Paid</p>
      </div>
    </div>
  );
}

function StatusTag() {
  return (
    <div className="absolute bg-[#fff9e6] content-stretch flex h-[32px] items-center justify-center left-[274.16px] px-[12px] rounded-[8px] top-0 w-[115.844px]" data-name="StatusTag">
      <Paragraph11 />
    </div>
  );
}

function Container65() {
  return (
    <div className="h-[32px] relative shrink-0 w-[390px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Heading />
        <Container66 />
        <StatusTag />
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M15 5L5 15" id="Vector" stroke="var(--stroke-0, #7E7E7E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5 5L15 15" id="Vector_2" stroke="var(--stroke-0, #7E7E7E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button28() {
  return (
    <div className="flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[10px] relative size-full">
          <Icon19 />
        </div>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Button28 />
      </div>
    </div>
  );
}

function PaymentScreen() {
  return (
    <div className="h-[64px] relative shrink-0 w-[1018px]" data-name="PaymentScreen">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-px px-[24px] relative size-full">
        <Container65 />
        <Container67 />
      </div>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="absolute h-[18px] left-[20px] top-[16px] w-[259px]" data-name="Paragraph">
      <p className="absolute font-['Lato:Bold',sans-serif] leading-[18px] left-0 not-italic text-[#a9a9a9] text-[12px] top-[-0.5px] tracking-[0.6px] uppercase whitespace-nowrap">Bill Summary</p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[24px] relative shrink-0 w-[177.844px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#282828] text-[16px] top-0 whitespace-nowrap">1x Bruschetta</p>
      </div>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[24px] relative shrink-0 w-[73.156px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#282828] text-[16px] top-0 whitespace-nowrap">Rp 65,000</p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex h-[24px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Paragraph13 />
      <Paragraph14 />
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[24px] relative shrink-0 w-[177.844px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#282828] text-[16px] top-0 whitespace-nowrap">1x Crème Brûlée</p>
      </div>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[24px] relative shrink-0 w-[73.156px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#282828] text-[16px] top-0 whitespace-nowrap">Rp 85,000</p>
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="content-stretch flex h-[24px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Paragraph15 />
      <Paragraph16 />
    </div>
  );
}

function Container69() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[536.398px] items-start left-0 pt-[16px] px-[20px] top-[50px] w-[299px]" data-name="Container">
      <Container70 />
      <Container71 />
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[24px] relative shrink-0 w-[59.367px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">Subtotal</p>
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[24px] relative shrink-0 w-[82.438px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">Rp 150,000</p>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="content-stretch flex h-[24px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text15 />
      <Text16 />
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[24px] relative shrink-0 w-[95.281px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">Service (10%)</p>
      </div>
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[24px] relative shrink-0 w-[73.156px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">Rp 15,000</p>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex h-[24px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text17 />
      <Text18 />
    </div>
  );
}

function Text19() {
  return (
    <div className="h-[24px] relative shrink-0 w-[58.164px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">Tax (5%)</p>
      </div>
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[24px] relative shrink-0 w-[63.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">Rp 7,500</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="content-stretch flex h-[24px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text19 />
      <Text20 />
    </div>
  );
}

function PrimitiveDiv4() {
  return <div className="bg-[#e9e9e9] h-px shrink-0 w-full" data-name="Primitive.div" />;
}

function Text21() {
  return (
    <div className="h-[24px] relative shrink-0 w-[81.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">Grand Total</p>
      </div>
    </div>
  );
}

function Text22() {
  return (
    <div className="h-[24px] relative shrink-0 w-[82.438px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">Rp 172,500</p>
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="content-stretch flex h-[24px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text21 />
      <Text22 />
    </div>
  );
}

function Text23() {
  return (
    <div className="h-[24px] relative shrink-0 w-[107.328px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">Previously Paid</p>
      </div>
    </div>
  );
}

function Text24() {
  return (
    <div className="h-[24px] relative shrink-0 w-[88.398px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#2e7d32] text-[16px] top-0 whitespace-nowrap">-Rp 123,625</p>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="content-stretch flex h-[24px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text23 />
      <Text24 />
    </div>
  );
}

function PrimitiveDiv5() {
  return <div className="bg-[#e9e9e9] h-px shrink-0 w-full" data-name="Primitive.div" />;
}

function Text25() {
  return (
    <div className="h-[24px] relative shrink-0 w-[76.031px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#282828] text-[16px] top-0 whitespace-nowrap">Remaining</p>
      </div>
    </div>
  );
}

function Text26() {
  return (
    <div className="h-[24px] relative shrink-0 w-[72.617px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#006bff] text-[16px] top-0 whitespace-nowrap">Rp 48,875</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex h-[24px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text25 />
      <Text26 />
    </div>
  );
}

function Container72() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[235px] items-start left-0 pt-[17px] px-[20px] top-[586.4px] w-[299px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-solid border-t inset-0 pointer-events-none" />
      <Container73 />
      <Container74 />
      <Container75 />
      <PrimitiveDiv4 />
      <Container76 />
      <Container77 />
      <PrimitiveDiv5 />
      <Container78 />
    </div>
  );
}

function Container68() {
  return (
    <div className="bg-white h-[821.398px] relative shrink-0 w-[300px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Paragraph12 />
        <Container69 />
        <Container72 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Heading21() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Lato:Bold',sans-serif] leading-[27px] left-0 not-italic text-[#282828] text-[18px] top-[0.5px] whitespace-nowrap">Bill</p>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Lato:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#7e7e7e] text-[12px] top-[-0.5px] whitespace-nowrap">2 splits · 1/2 paid</p>
    </div>
  );
}

function Container81() {
  return (
    <div className="h-[47px] relative shrink-0 w-[88.063px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start relative size-full">
        <Heading21 />
        <Paragraph17 />
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute left-[21.5px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1addaf80} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19602f00} id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 8H10.6667" id="Vector_3" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MainBtn14() {
  return (
    <div className="bg-[#e6f0ff] flex-[1_0_0] h-[56px] min-h-px min-w-px opacity-50 relative rounded-[12px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#006bff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon20 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[98px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">Combine Bill</p>
      </div>
    </div>
  );
}

function Icon21() {
  return (
    <div className="absolute left-[21.5px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MainBtn15() {
  return (
    <div className="bg-[#e6f0ff] h-[56px] relative rounded-[12px] shrink-0 w-[141.148px]" data-name="MainBtn">
      <div aria-hidden="true" className="absolute border-[#006bff] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon21 />
        <p className="-translate-x-1/2 absolute font-['Lato:SemiBold',sans-serif] leading-[27px] left-[84px] not-italic text-[#282828] text-[18px] text-center top-[15px] whitespace-nowrap">{` Add Split`}</p>
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="h-[56px] relative shrink-0 w-[318.656px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <MainBtn14 />
        <MainBtn15 />
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="h-[81px] relative shrink-0 w-[718px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-px px-[20px] relative size-full">
        <Container81 />
        <Container82 />
      </div>
    </div>
  );
}

function Container86() {
  return <div className="absolute border border-[#e9e9e9] border-solid h-[65px] left-[-0.5px] rounded-[12px] top-[-0.5px] w-[276px]" data-name="Container" />;
}

function Text27() {
  return (
    <div className="h-[26px] relative shrink-0 w-[63.07px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[26px] left-[32.5px] not-italic text-[#006bff] text-[18px] text-center top-0 tracking-[0.1238px] whitespace-nowrap">By Item</p>
      </div>
    </div>
  );
}

function Button29() {
  return (
    <div className="absolute bg-white content-stretch flex h-[56px] items-center justify-center left-[4px] pl-[34.211px] pr-[34.219px] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.12)] top-[4px] w-[131.5px]" data-name="Button">
      <Text27 />
    </div>
  );
}

function Text28() {
  return (
    <div className="h-[26px] relative shrink-0 w-[100.75px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[26px] left-[50px] not-italic text-[#282828] text-[18px] text-center top-0 tracking-[0.1238px] whitespace-nowrap">By Category</p>
      </div>
    </div>
  );
}

function Button30() {
  return (
    <div className="absolute bg-[#f4f4f4] content-stretch flex h-[56px] items-center justify-center left-[139.5px] px-[15.375px] rounded-[12px] top-[4px] w-[131.5px]" data-name="Button">
      <Text28 />
    </div>
  );
}

function TabGroup1() {
  return (
    <div className="bg-[#e9e9e9] h-[64px] relative rounded-[12px] shrink-0 w-full" data-name="TabGroup">
      <Container86 />
      <Button29 />
      <Button30 />
    </div>
  );
}

function Container85() {
  return (
    <div className="bg-white h-[85px] relative shrink-0 w-[299px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pt-[12px] px-[12px] relative size-full">
        <TabGroup1 />
      </div>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="absolute h-[24px] left-[8px] overflow-clip top-[8px] w-[259px]" data-name="Paragraph">
      <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#282828] text-[16px] top-0 whitespace-nowrap">Bruschetta</p>
    </div>
  );
}

function Text30() {
  return (
    <div className="h-[27px] relative shrink-0 w-[10.445px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[27px] left-[5.5px] not-italic opacity-50 text-[#2e7d32] text-[18px] text-center top-[0.5px] whitespace-nowrap">1</p>
      </div>
    </div>
  );
}

function Text29() {
  return (
    <div className="h-[27px] relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-full items-center relative">
        <Text30 />
      </div>
    </div>
  );
}

function Button31() {
  return (
    <div className="bg-[#e8f5e9] relative rounded-[999px] shrink-0 size-[56px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12px] relative size-full">
        <Text29 />
      </div>
    </div>
  );
}

function Container91() {
  return (
    <div className="h-[56px] relative shrink-0 w-[259px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <Button31 />
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="content-stretch flex flex-col h-[58px] items-start relative shrink-0 w-full" data-name="Container">
      <Container91 />
    </div>
  );
}

function Container89() {
  return (
    <div className="absolute content-stretch flex flex-col h-[75px] items-start left-0 pt-[9px] px-[8px] top-[36px] w-[275px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-solid border-t inset-0 pointer-events-none" />
      <Container90 />
    </div>
  );
}

function ByItemPanel() {
  return (
    <div className="bg-white h-[111px] relative rounded-[8px] shrink-0 w-full" data-name="ByItemPanel">
      <Paragraph18 />
      <Container89 />
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="absolute h-[24px] left-[8px] overflow-clip top-[8px] w-[259px]" data-name="Paragraph">
      <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#282828] text-[16px] top-0 whitespace-nowrap">Crème Brûlée</p>
    </div>
  );
}

function Text32() {
  return (
    <div className="h-[27px] relative shrink-0 w-[10.445px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[27px] left-[5.5px] not-italic opacity-50 text-[#2e7d32] text-[18px] text-center top-[0.5px] whitespace-nowrap">1</p>
      </div>
    </div>
  );
}

function Text31() {
  return (
    <div className="h-[27px] relative shrink-0 w-[26.445px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Text32 />
      </div>
    </div>
  );
}

function Button32() {
  return (
    <div className="bg-[#e8f5e9] relative rounded-[28px] shrink-0 size-[56px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-[12.273px] pr-[12.281px] relative size-full">
        <Text31 />
      </div>
    </div>
  );
}

function Button33() {
  return (
    <div className="bg-[#006bff] relative rounded-[28px] shrink-0 size-[56px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#006bff] border-[2.5px] border-solid inset-0 pointer-events-none rounded-[28px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[2.5px] relative size-full">
        <p className="font-['Lato:Bold',sans-serif] leading-[27px] not-italic relative shrink-0 text-[18px] text-center text-white whitespace-nowrap">2</p>
      </div>
    </div>
  );
}

function Button34() {
  return (
    <div className="relative rounded-[28px] shrink-0 size-[56px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#006bff] border-[2.5px] border-solid inset-0 pointer-events-none rounded-[28px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[2.5px] relative size-full">
        <p className="font-['Lato:Bold',sans-serif] leading-[27px] not-italic relative shrink-0 text-[#006bff] text-[18px] text-center whitespace-nowrap">3</p>
      </div>
    </div>
  );
}

function Container94() {
  return (
    <div className="h-[56px] relative shrink-0 w-[259px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative size-full">
        <Button32 />
        <Button33 />
        <Button34 />
      </div>
    </div>
  );
}

function Container93() {
  return (
    <div className="content-stretch flex flex-col h-[58px] items-start relative shrink-0 w-full" data-name="Container">
      <Container94 />
    </div>
  );
}

function Container92() {
  return (
    <div className="absolute content-stretch flex flex-col h-[75px] items-start left-0 pt-[9px] px-[8px] top-[36px] w-[275px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-solid border-t inset-0 pointer-events-none" />
      <Container93 />
    </div>
  );
}

function ByItemPanel1() {
  return (
    <div className="bg-white h-[111px] relative rounded-[8px] shrink-0 w-full" data-name="ByItemPanel">
      <Paragraph19 />
      <Container92 />
    </div>
  );
}

function Container88() {
  return (
    <div className="h-[254px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[4px] items-start pt-[12px] px-[12px] relative size-full">
        <ByItemPanel />
        <ByItemPanel1 />
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div className="flex-[655.398_0_0] min-h-px min-w-px relative w-[299px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container88 />
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="h-[740.398px] relative shrink-0 w-[300px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pr-px relative rounded-[inherit] size-full">
        <Container85 />
        <Container87 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-r border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon22() {
  return (
    <div className="absolute left-[20px] size-[16px] top-[18px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p39be50} id="Vector" stroke="var(--stroke-0, #2E7D32)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button35() {
  return (
    <div className="absolute bg-[#e8f5e9] border-2 border-[#2e7d32] border-solid h-[56px] left-[16px] rounded-[999px] top-[16px] w-[116.477px]" data-name="Button">
      <Icon22 />
      <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[27px] left-[67.5px] not-italic text-[#2e7d32] text-[18px] text-center top-[13px] whitespace-nowrap">Split 1</p>
    </div>
  );
}

function Button36() {
  return (
    <div className="absolute bg-[#e6f0ff] content-stretch flex h-[56px] items-center left-[140.48px] px-[22px] py-[2px] rounded-[999px] top-[16px] w-[94.477px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#006bff] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['Lato:Bold',sans-serif] leading-[27px] not-italic relative shrink-0 text-[#006bff] text-[18px] text-center whitespace-nowrap">Split 2</p>
    </div>
  );
}

function Button37() {
  return (
    <div className="absolute bg-white content-stretch flex h-[56px] items-center left-[242.95px] px-[22px] py-[2px] rounded-[999px] top-[16px] w-[94.477px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['Lato:Bold',sans-serif] leading-[27px] not-italic relative shrink-0 text-[#7e7e7e] text-[18px] text-center whitespace-nowrap">Split 3</p>
    </div>
  );
}

function Container96() {
  return (
    <div className="h-[85px] relative shrink-0 w-[418px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button35 />
        <Button36 />
        <Button37 />
      </div>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#282828] text-[16px] top-0 whitespace-nowrap">Split 2</p>
      </div>
    </div>
  );
}

function Text33() {
  return (
    <div className="h-[18px] relative shrink-0 w-[32.969px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#a9a9a9] text-[12px] top-[-0.5px] whitespace-nowrap">1 item</p>
      </div>
    </div>
  );
}

function Container98() {
  return (
    <div className="h-[24px] relative shrink-0 w-[85.836px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Paragraph20 />
        <Text33 />
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M2.5 5H17.5" id="Vector" stroke="var(--stroke-0, #D32F2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p26c6b600} id="Vector_2" stroke="var(--stroke-0, #D32F2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p276bd300} id="Vector_3" stroke="var(--stroke-0, #D32F2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 9.16667V14.1667" id="Vector_4" stroke="var(--stroke-0, #D32F2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M11.6667 9.16667V14.1667" id="Vector_5" stroke="var(--stroke-0, #D32F2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button38() {
  return (
    <div className="bg-[#ffebee] relative rounded-[8px] shrink-0 size-[44px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#d32f2f] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12px] py-[1.5px] relative size-full">
        <Icon23 />
      </div>
    </div>
  );
}

function Container97() {
  return (
    <div className="h-[69px] relative shrink-0 w-[418px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e9e9e9] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-px px-[16px] relative size-full">
        <Container98 />
        <Button38 />
      </div>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="h-[24px] relative shrink-0 w-[96.961px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">Crème Brûlée</p>
      </div>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="h-[24px] relative shrink-0 w-[73.156px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">Rp 42,500</p>
      </div>
    </div>
  );
}

function PaymentScreen2() {
  return (
    <div className="content-stretch flex h-[28px] items-start justify-between pt-[2px] relative shrink-0 w-full" data-name="PaymentScreen">
      <Paragraph21 />
      <Paragraph22 />
    </div>
  );
}

function PrimitiveDiv6() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative w-[418px]" data-name="Primitive.div">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] px-[16px] relative size-full">
          <PaymentScreen2 />
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_1px_0px_0px_0px_#e9e9e9]" />
    </div>
  );
}

function Text34() {
  return (
    <div className="h-[24px] relative shrink-0 w-[167.797px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#7e7e7e] text-[16px] top-0 whitespace-nowrap">{`Total (incl. tax & service)`}</p>
      </div>
    </div>
  );
}

function Text35() {
  return (
    <div className="h-[24px] relative shrink-0 w-[72.617px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Lato:Bold',sans-serif] leading-[24px] left-0 not-italic text-[#006bff] text-[16px] top-0 whitespace-nowrap">Rp 48,875</p>
      </div>
    </div>
  );
}

function Container100() {
  return (
    <div className="absolute content-stretch flex h-[48px] items-center justify-between left-0 px-[16px] top-[2px] w-[418px]" data-name="Container">
      <Text34 />
      <Text35 />
    </div>
  );
}

function MainBtn16() {
  return (
    <div className="absolute bg-[#006bff] border-2 border-[#006bff] border-solid h-[56px] left-[16px] rounded-[12px] top-[50px] w-[386px]" data-name="MainBtn">
      <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] leading-[27px] left-[191.27px] not-italic text-[18px] text-center text-white top-[13px] whitespace-nowrap">Pay Split 2</p>
    </div>
  );
}

function Container99() {
  return (
    <div className="h-[122px] relative shrink-0 w-[418px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,107,255,0.25)] border-solid border-t-2 inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container100 />
        <MainBtn16 />
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="flex-[418_0_0] h-[740.398px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container96 />
        <Container97 />
        <PrimitiveDiv6 />
        <Container99 />
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="flex-[740.398_0_0] min-h-px min-w-px relative w-[718px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <Container84 />
        <Container95 />
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="flex-[1_0_0] h-[821.398px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container80 />
        <Container83 />
      </div>
    </div>
  );
}

function PaymentScreen1() {
  return (
    <div className="flex-[821.398_0_0] min-h-px min-w-px relative w-[1018px]" data-name="PaymentScreen">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <Container68 />
        <Container79 />
      </div>
    </div>
  );
}

function PrimitiveDiv3() {
  return (
    <div className="absolute bg-white h-[887.398px] left-[174.5px] rounded-[12px] top-[49.3px] w-[1020px]" data-name="Primitive.div">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <PaymentScreen />
        <PaymentScreen1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function SnackbarProvider() {
  return <div className="absolute left-[684.5px] size-0 top-[962px]" data-name="SnackbarProvider" />;
}

export default function RmsTabletChangeLayout() {
  return (
    <div className="bg-white relative size-full" data-name="RMS Tablet - Change layout">
      <FohLayout />
      <OperationalOrderScreenContent3 />
      <PrimitiveDiv2 />
      <PrimitiveDiv3 />
      <SnackbarProvider />
    </div>
  );
}