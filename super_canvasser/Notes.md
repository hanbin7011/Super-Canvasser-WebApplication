# Git collaboration 

- Every time you collaborate, make sure you have a working code before pushing to the repo.
- Before start working on your code, make sure you're on Master branch in your local directory. 
- Then pull it first (to get latest version from the remote Master origin). This is from the Master branch in Github.

	`$ git pull origin master`

- In your local directory, create a new branch for your new features you want to add. 
  For example, if I want to add Calendar page, I'll do:

	`$ git checkout -b calendar`

  This creates a new branch named "calendar" and moves to it.
- Once you added new features in this current newly created branch, commit it in this branch.
- Then you want to push your new code to the repo, do:

	`$ git push origin calendar`

  This will push your collaborated code from "Calendar" branch into the remote origin.
- Then you need to go to Github, create a Pull request at this branch.
- You or other members in the team can review your new code and merge it into Master branch of the remote origin.
- So now we all have a remote Master branch with updated code created by you.
- Everyone can pull this update down to their Master branch in local their directory and keep collaborating.
- For you, right now you're still in "Calendar" branch.
- If you now want to add more new features, repeat above steps by first switching back to Master branch.
- Pull updates you just updated in Master origin down to your local Master branch.
	
	`$ git pull origin master.`

	This repeats all steps above.
- You can delete "Calendar" branch now, and create new branch:

	`$ git checkout -b <New Page>`

- Keep working again like above from here...
