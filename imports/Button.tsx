import imgImageCaesarSalad from "figma:asset/b5de5f1ace9dc8c4cb1b2c5c6ba0c1bfab0332c5.png";

function Paragraph() {
  return (
    <div className="h-[20.797px] relative shrink-0 w-[186.797px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Lato:SemiBold',sans-serif] leading-[20.8px] left-0 not-italic text-[20px] text-white top-[-0.5px] whitespace-nowrap">Caesar Salad</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[#f97316] content-stretch flex flex-col h-[55.594px] items-start justify-center left-0 pl-[10px] py-[8px] top-[100px] w-[206.797px]" data-name="Container">
      <Paragraph />
    </div>
  );
}

function ImageCaesarSalad() {
  return (
    <div className="absolute h-[100px] left-0 top-0 w-[206.797px]" data-name="Image (Caesar Salad)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageCaesarSalad} />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-[#f97316] h-[100px] left-0 overflow-clip top-0 w-[206.797px]" data-name="Container">
      <ImageCaesarSalad />
    </div>
  );
}

export default function Button() {
  return (
    <div className="bg-white border-[#e9e9e9] border-[1.5px] border-solid overflow-clip relative rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)] size-full" data-name="Button">
      <Container />
      <Container1 />
    </div>
  );
}