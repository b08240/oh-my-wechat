import ChatList from "@/components/chat-list.tsx";
import MessageList from "@/components/message-list.tsx";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import AccountSelectDialog from "@/components/account-select-dialog.tsx";
import MediaViewerDialog from "@/components/media-viewer-dialog.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { useApp } from "@/lib/hooks/appProvider.tsx";
import { useDatabase } from "@/lib/hooks/databaseProvider.tsx";
import ContactList from "./components/contact-list";
import { cn } from "./lib/utils";

import {
  ChatIconFill,
  ChatIconOutline,
  ContactIconFill,
  ContactIconOutline,
} from "@/components/icon.tsx";
import Wrapped2024 from "@/components/statistic/wrapped-2024/wrapped-2024.tsx";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const App = () => {
  const { databases } = useDatabase();
  const { user, chat, setChat, isOpenMediaViewer, setIsOpenMediaViewer } =
    useApp();

  return (
    <>
      {!user && <AccountSelectDialog open={!user} />}

      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen max-h-screen items-stretch"
      >
        <ResizablePanel defaultSize={25} minSize={10} className="flex">
          <Tabs defaultValue="sessions" className="w-full flex">
            <div className={"flex flex-col justify-between border-r"}>
              <TabsList className="h-auto p-0 flex flex-col bg-transparent">
                <TabsTrigger
                  value="sessions"
                  className={cn(
                    "w-16 h-16 p-0 flex flex-col",
                    "group data-[state=active]:text-[#03C160] rounded-none after:content-none hover:bg-neutral-100",
                  )}
                >
                  <div className="mt-1 w-8 h-8">
                    <ChatIconOutline
                      className={"group-data-[state=active]:hidden size-full"}
                    />
                    <ChatIconFill
                      className={
                        "hidden group-data-[state=active]:block size-full"
                      }
                    />
                  </div>
                  <span className="mt-1 text-xs">消息</span>
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className={cn(
                    "w-16 h-16 p-0 flex flex-col",
                    "group data-[state=active]:text-[#03C160] rounded-none after:content-none hover:bg-neutral-100",
                  )}
                >
                  <div className="mt-1 w-8 h-8">
                    <ContactIconOutline
                      className={"group-data-[state=active]:hidden size-full"}
                    />
                    <ContactIconFill
                      className={
                        "hidden group-data-[state=active]:block size-full"
                      }
                    />
                  </div>
                  <span className="mt-1 text-xs">通讯录</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="sessions" className="grow m-0">
              <div className={"relative w-full h-full"}>
                <div className={"absolute inset-0"}>
                  <ScrollArea className={"w-full h-full [&>div>div]:!block"}>
                    {databases && user && (
                      <ChatList
                        onClick={(chat) => {
                          setChat(chat);
                        }}
                      />
                    )}
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="contact" className="grow">
              <ScrollArea className={"h-full"}>
                {databases && user && (
                  <ContactList
                    onClick={() => {
                      // setChat()
                    }}
                  />
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel>
          {databases && user && chat && (
            <div className="w-full h-full overflow-auto">
              <MessageList
                chat={chat}
                isChatroom={chat.type === "chatroom"}
                className="w-full h-full"
              />
            </div>
          )}

          {databases && user && !chat && (
            <div className="w-full h-full overflow-auto">
              <Wrapped2024
                startTime={new Date("2024/1/1")}
                endTime={new Date("2025/1/1")}
              />
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>

      {chat && (
        <MediaViewerDialog
          open={isOpenMediaViewer}
          onOpenChange={setIsOpenMediaViewer}
          chat={chat}
        />
      )}

      {databases && user && (
        <Dialog>
          <DialogContent
            className={"p-0 bg-transparent border-none shadow-none "}
          >
            <VisuallyHidden>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </VisuallyHidden>
            <article className={"pb-[133.333333%] bg-red-400"}></article>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default App;
