const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section
      className="h-full flex justify-center items-center md:bg-[url(https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.497/trello-left.4f52d13c.svg),_url(https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.497/trello-right.3ee60d6f.svg)]
    // bg-[position:bottom_1rem_left_1rem,_bottom_1rem_right_1rem]
    //  bg-no-repeat
    //  bg-fixed
    //  bg-[length:368px_368px]"
    >
      {children}
    </section>
  );
};

export default ClerkLayout;
