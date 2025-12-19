import React from "react";
import { SunIcon, MoonIcon, BellIcon, Loader2, Sparkles } from "lucide-react";
import { Button } from "../atoms/button";
import { useAppTheme } from "../use-app-theme";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { User } from "@/store/tweetSlice";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../atoms/avatar";
import { localStorageUtil } from "@/_core/utils";
import { useAppDispatch, useAppSelector } from "@/store/useStore";
import {
  fetchTweetsAction,
  followRequestAction,
  unFollowRequestAction,
  fetchTrendingTopicsAction,
  suggestTweetContentAction,
} from "@/modules/tweet";
import { useCommunities } from "@/modules/communities/hooks/useCommunities";
import { Users } from "lucide-react";

interface RightTweetSidebarProps {
  userData: {
    username: string;
    email: string;
  };
  following: User[];
  suggetions: User[];
}
const RightTweetSidebar = ({
  userData,
  following,
  suggetions,
}: RightTweetSidebarProps) => {
  const dispatch = useAppDispatch();

  const { toggleTheme, isDark } = useAppTheme();
  const notifications =
    localStorageUtil.getItem<
      { content: string; status: "success" | "error"; time: string }[]
    >("NOTIFICATIONS") || [];

  const { trendingTopics, isSuggesting } = useAppSelector((state) => state.tweet);
  const [showAllFollowing, setShowAllFollowing] = React.useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = React.useState(false);
  const [showAllTrending, setShowAllTrending] = React.useState(false);

  const { communities, join, isLoading: isCommunitiesLoading } = useCommunities();
  const suggestedCommunities = communities.filter(c => !c.joined);
  const [showAllCommunities, setShowAllCommunities] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchTrendingTopicsAction());
  }, [dispatch]);

  const handleFollow = (id: string) => {
    dispatch(followRequestAction(id));
    dispatch(fetchTweetsAction());
  };

  const handleUnFollow = (id: string) => {
    dispatch(unFollowRequestAction(id));
    dispatch(fetchTweetsAction());
  };

  return (
    <div className=" h-screen w-full overflow-y-auto">
      {/* Header with actions */}
      <div className="flex items-center justify-between p-4 mb-6 border-b border-sidebar-border">
        <div className="flex items-center gap-x-2">
          <div className="p-1  rounded-full bg-gradient-to-tr from-blue-600 to-blue-900">
            <Avatar className=" size-10 ">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${userData?.username}`}
                alt="User Avatar"
              />
              <AvatarFallback>{userData?.username.slice(0, 1)}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="text-sm font-medium text-sidebar-foreground max-w-[130px] truncate overflow-hidden text-ellipsis">
              {userData?.username.toUpperCase()}
            </p>
            <p className="text-xs text-muted-foreground max-w-[130px] truncate overflow-hidden text-ellipsis">
              {userData.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <SunIcon className="size-4 text-muted-foreground" />
            ) : (
              <MoonIcon className="size-4 text-muted-foreground" />
            )}
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle notifications"
              >
                <BellIcon className="size-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="px-0 w-80">
              <h4 className="text-sm font-semibold text-sidebar-foreground mb-2 px-4">
                Notifications
              </h4>
              <ul className="space-y-2 max-h-[12.75rem] overflow-y-auto pl-4 pr-2">
                {notifications.map((item, index) => (
                  <li
                    key={index}
                    className="text-xs text-muted-foreground grid grid-cols-[1fr_3.6rem]"
                  >
                    <span>{item.content}</span>
                    <span className="text-right">{item.time}</span>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Trending Topics Section */}
      <div className="mb-8 py-4 pr-1">
        <div className="flex items-center justify-between mb-2 px-4">
          <h3 className="text-lg font-semibold text-sidebar-foreground">
            Trending Now
          </h3>
        </div>
        <div className="space-y-3 pl-4 pr-2">
          {trendingTopics && trendingTopics.length > 0 ? (
            // Limit to top 10, then slice based on toggle
            trendingTopics.slice(0, 10).slice(0, showAllTrending ? 10 : 3).map((topic, index) => (
              <div key={index} className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 rounded-md transition-colors">
                <div>
                  <p className="text-sm font-bold text-sidebar-foreground">#{topic.name}</p>
                  <p className="text-xs text-muted-foreground">{topic.score} tweets</p>
                </div>
                {/* <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0">→</Button> */}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No trends yet.</p>
          )}

          {trendingTopics && trendingTopics.length > 3 && (
            <Button
              variant="link"
              className="px-0 h-auto text-sm text-muted-foreground"
              onClick={() => setShowAllTrending(!showAllTrending)}
            >
              {showAllTrending ? "Show Less" : "Show More"}
            </Button>
          )}
        </div>
      </div>

      {/* Suggested Communities Section */}
      <div className="mb-8 py-4 pr-1">
        <div className="flex items-center justify-between mb-2 px-4">
          <h3 className="text-lg font-semibold text-sidebar-foreground">
            Communities
          </h3>
        </div>
        <div className="space-y-3 pl-4 pr-2">
          {isCommunitiesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-9 w-9 bg-muted rounded-md animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
                    <div className="h-2 w-1/2 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : suggestedCommunities && suggestedCommunities.length > 0 ? (
            (showAllCommunities ? suggestedCommunities : suggestedCommunities.slice(0, 3)).map((community, index) => (
              <div key={index} className="flex items-center justify-between group">
                <div className="flex items-center gap-x-3 overflow-hidden">
                  <div className="p-2 rounded-md bg-muted/50 group-hover:bg-muted transition-colors">
                    <Users className="size-5 text-muted-foreground" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-sidebar-foreground truncate" title={community.name}>
                      {community.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate" title={community.description}>
                      {community.description || "No description"}
                    </p>
                  </div>
                </div>
                <Button
                  className="h-8 text-xs px-3"
                  variant="secondary"
                  onClick={() => join(community.id)}
                >
                  Join
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No new communities to join.</p>
          )}

          {!isCommunitiesLoading && suggestedCommunities.length > 3 && (
            <Button
              variant="link"
              className="px-0 h-auto text-sm text-muted-foreground"
              onClick={() => setShowAllCommunities(!showAllCommunities)}
            >
              {showAllCommunities ? "Show Less" : "Show More"}
            </Button>
          )}
        </div>
      </div>

      {/* Suggested For You Section */}
      <div className="mb-8 py-4 pr-1">
        <div className="flex items-center justify-between mb-4 px-4">
          <h3 className="text-lg font-semibold text-sidebar-foreground">
            Suggested For You
          </h3>
        </div>
        <div className="space-y-3 overflow-y-auto pl-4 pr-2">
          {(showAllSuggestions ? suggetions : suggetions.slice(0, 3)).map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                <div className="p-0.5  rounded-full bg-gradient-to-tr from-muted-foreground/50 to-muted-foreground">
                  <Avatar className="w-10">
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?u=${user.username}`}
                    />
                    <AvatarFallback>
                      {user?.username.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground max-w-[100px] truncate overflow-hidden text-ellipsis">
                    {user.username}
                  </p>
                </div>
              </div>
              <Button className="h-8" onClick={() => handleFollow(user.id)}>
                Follow
              </Button>
            </div>
          ))}
          {suggetions.length > 3 && (
            <Button
              variant="link"
              className="px-0 h-auto text-sm text-muted-foreground"
              onClick={() => setShowAllSuggestions(!showAllSuggestions)}
            >
              {showAllSuggestions ? "Show Less" : "Show More"}
            </Button>
          )}
        </div>
      </div>

      {/* Following Section */}
      <div className="mb-8 py-4 pr-1">
        <div className="flex items-center justify-between mb-4 px-4">
          <h3 className="text-lg font-semibold text-sidebar-foreground">
            Following
          </h3>
        </div>
        <div className="space-y-3 overflow-y-auto pl-4 pr-2">
          {following &&
            (showAllFollowing ? following : following.slice(0, 3)).map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <div className="p-0.5  rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600">
                    <Avatar className="w-10">
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?u=${user.username}`}
                      />
                      <AvatarFallback>
                        {user?.username.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-sidebar-foreground max-w-[100px] truncate overflow-hidden text-ellipsis">
                      {user.username}
                    </p>
                  </div>
                </div>
                <Button className="h-8" onClick={() => handleUnFollow(user.id)}>
                  Unfollow
                </Button>
              </div>
            ))}
          {following && following.length > 3 && (
            <Button
              variant="link"
              className="px-0 h-auto text-sm text-muted-foreground"
              onClick={() => setShowAllFollowing(!showAllFollowing)}
            >
              {showAllFollowing ? "Show Less" : "Show More"}
            </Button>
          )}
        </div>
      </div>

      {/* AI Content Suggestion */}
      <div className="mb-8 py-4 px-4 border-t border-sidebar-border">
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          onClick={() => dispatch(suggestTweetContentAction())}
          disabled={isSuggesting}
        >
          {isSuggesting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          AI Content Suggestion
        </Button>
      </div>
    </div>
  );
};

export default RightTweetSidebar;
