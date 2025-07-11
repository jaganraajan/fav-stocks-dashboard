import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack";

export default function Handler(props: unknown) {
  console.log("Route Props:", props); // Log the route props for debugging purposes
  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}
