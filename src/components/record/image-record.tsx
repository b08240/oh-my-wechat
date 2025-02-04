import LocalImage from "@/components/local-image";
import type { MessageVM, RecordType } from "@/lib/schema.ts";
import { cn } from "@/lib/utils.ts";
import type { RecordVM } from "./record";

interface ImageRecordProps extends React.HTMLAttributes<HTMLDivElement> {
  message: MessageVM;
  record: ImageRecordEntity;
  variant: "default" | string;
}

export interface ImageRecordEntity extends RecordVM {
  "@_datatype": RecordType.IMAGE;

  datafmt: string; // e.g. "pic"

  thumbsize: number;
  thumbfullmd5: string;

  datasize: number;
  fullmd5: string;
}

export default function ImageRecord({
  message,
  record,
  variant = "default",
  className,
  ...props
}: ImageRecordProps) {
  const { chat } = message;

  if (variant === "default")
    return (
      <div className={cn("rounded-lg overflow-hidden", className)} {...props}>
        <LocalImage
          domain="opendata"
          chat={chat}
          message={message}
          record={record}
          size="origin"
          alt={"图片"}
          className={
            "max-w-[16em] max-h-[32rem] min-w-32 min-h-16 object-contain bg-white"
          }
        />
      </div>
    );

  return (
    <p className="inline">
      <LocalImage
        domain="opendata"
        chat={chat}
        message={message}
        record={record}
        size="origin"
        alt={"图片"}
        className={
          "inline mx-[0.2em] align-top max-w-16 max-h-16 rounded overflow-hidden"
        }
      />
    </p>
  );
}
