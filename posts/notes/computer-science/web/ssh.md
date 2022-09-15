---
title: "Use SSH Public Key Authentication"
date: "2022-09-15"
---

Without use any prompt password, `ssh` provides a beautiful way to run ssh command.

1. Create SSH Key pair, i.e., public/private key.
2. Upload the key pair to server.

### Step1. Create SSH Key Pair <a name="step1"></a>
If you already have a key pair, you can ignore this step, and use your old pair to continue (Go to [next step](#step2)).

Create a new ssh key pair, just run command:

```shell
> cd ~/.ssh # go to this directory
> ssh-keygen # create pair
```

then you need fill all the questions, it looks like: (Here I create a pair named `demo_rsa`)
```shell
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/youxingz/.ssh/id_rsa): demo_rsa
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in demo_rsa
Your public key has been saved in demo_rsa.pub
The key fingerprint is:
SHA256:D3hdvNqzxe12wMHFJpxmCipgmG2wbw3Ikz75uO6x/RA youxingz@WarmestolorsMBP
The key's randomart image is:
+---[RSA 3072]----+
|  .=         . o |
| .o+=     ..  * +|
|  *o..   . .o= + |
| . + o.... ...o  |
|  + E o.S . .. . |
|   = . . o o .o. |
|  o o     o o o..|
|   = .       + .o|
| o= ...     .  .o|
+----[SHA256]-----+
```

Now, you can check your files under this directory (`~/.ssh`), there are two files named `demo_rsa` and `demo_rsa.pub`, corresponding private & public key.

### Step2. Upload to server <a name="step2"></a>

```shell
> ssh-copy-id -i demo_rsa [user]@[host]
> # type your password
```

Then you can run `ssh [user]@[host]` without any password prompt required.
