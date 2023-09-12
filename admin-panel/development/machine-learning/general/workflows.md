---
description: References for commonly used tools for model pipelines and collaboration.
---

# Workflows



## Intro

We use several tools to collaboratively visualize Greenstand data and perform analysis experiments. Large datasets we use are stored on S3, while smaller datasets are shared in Slack, stored in Google Drive, or stored in S3 as well.

Make sure you have a Github account prior to contribution, especially if modifying other people’s code. While our R\&D development is fairly lenient with version-control practices, please keep in mind that general good practice is to make small commits to notebooks that are shared with others and fork the repository prior to making larger changes.

## Google Colab

Google Colab is a hosted Jupyter notebook platform that you can access for **free** with a Google account. Colab has **GPU resources** available and can run most Jupyter notebooks out of box. However, resources are limited on Colab and collaborative coding is not possible.

For information on mounting Google Drive to Google Colab and integrating Github, check out [this link.](https://towardsdatascience.com/google-drive-google-colab-github-dont-just-read-do-it-5554d5824228)

## DeepNote

[Deepnote](http://www.deepnote.com/) is another **free** hosted Jupyter notebook platform. Unlike Colab, it does not offer GPU instances, but it does offer integration with S3 and “Shared Datasets”, and allows **real-time collaboration**. All of these are accessible as mounted filesystems, so your hosted notebook can access data as if it were local and the service has several built-in features that make data visualization easier.

## AWS Sagemaker

To access AWS resources, you will first need credentials provided by Zaven or Shubhom.

**A golden rule: Remember to terminate your instances!**

#### Overview

Sagemaker is enabled with JupyterLab. You have several options depending on your goal:

* Notebook instances: good for debugging, quick runs, small training processes, and interactive visualizations/prototypes
* Training jobs: the best way to run full training for large models (cheaper for us)
* Processing jobs: the best way to perform large preprocessing on an entire dataset

Documentation is located at [https://docs.aws.amazon.com/sagemaker/](https://docs.aws.amazon.com/sagemaker/),

#### Github Connection

Linking Github to your AWS instances is useful and enables you easily store your notebooks. This is especially useful because any information not stored in S3 storage is deleted from instance notebooks, i.e. any ad-hoc processes you may be working on. It is highly recommended therefore you connect the data analysis Github repository with your AWS Sagemaker.

To do this, go to Notebook -> Git repositories -> Add repository. There you can enter what you’ll call the repo (doesn’t have to be the same name as in Github) and link to the repository itself. Assuming this is the shared image analysis team repo, that’ll be:

[https://github.com/Greenstand/treetracker-machine-learning](https://github.com/Greenstand/treetracker-machine-learning)

Next, your credential will be determined by a secret. You’ll need to generate a Personal Access Token in your Github account (see [this site for how to do this](https://howchoo.com/github/github-generate-personal-access-tokens)). Then, you’ll be able to use your Github username and the token as the password in order to link your Sagemaker work with Github. You can name the secret whatever you want. The

#### Notebook instances

Notebook instances are best for interactive work such as visualization and debugging. This is all-purpose compute and thus billed higher, so CPU-enabled instances should suffice for most use cases.

To create a notebook instance, go to Notebook>Notebook instances>Create notebook instance. You can name your instance whatever you want. The instance type depends on your needs: you will need to decide how much memory and how many cores are suitable for you. If in doubt, feel free to experiment or ask an administrator for help. Again, remember to terminate your instances after completing work. If it’s not available already, you will need to add the Greenstand data analysis repo as the default repository you are working with. If you’re collaborating with others it’s preferable you create a branch, but if you are working on interactive notebooks that are backed up or otherwise are comfortable you may commit to master.

#### Experiments

An overview of experiments can be found at: [https://github.com/aws/sagemaker-experiments](https://github.com/aws/sagemaker-experiments).

#### Training jobs

To run long training jobs (e.g. deep learning jobs), it’s more economical to use dedicated resources via a training job. See the [Github](https://github.com/aws/amazon-sagemaker-examples/tree/master/sagemaker-python-sdk/pytorch\_mnist) repo for a concrete example. The idea behind these is that one notebook uses the Sagemaker API to create and manage a Sagemaker instance that runs a script that you create. The script that you create can reference environment variables that are set in the Sagemaker host machine from the managing notebook. Feel free to ask any questions if this is confusing!

#### Processing jobs

Similar to the training job, preprocessing job are called from the Sagemaker API to create and manage a Sagemaker instance that runs a preprocessing script that you create. The script that you create can reference environment variables that are set in the Sagemaker host machine from the managing notebook. This allows you to use different compute for different tasks and allows a greater control of your experiment’s pipeline (different models may require different preprocessing, so

#### GPU Compute

When using GPU enabled compute, please notify a team admin prior to running. You will be required to [review the device pricing(GPUs are “accelerated computing”)](https://aws.amazon.com/sagemaker/pricing/) and submit an estimated cost.

Ways to perform GPU Compute on SageMaker, from StackOverflow (@[Olivier Cruchant](https://stackoverflow.com/users/5331834/olivier-cruchant))

You train models on GPU in the SageMaker ecosystem in each of the 2 ways mentioned previously:

1. You can instantiate a GPU-powered [**SageMaker Notebook Instance**](https://docs.aws.amazon.com/sagemaker/latest/dg/nbi.html), for example p2.xlarge (NVIDIA K80) or p3.2xlarge (NVIDIA V100). This is convenient for interactive development - you have the GPU right under your notebook and can run code on the GPU interactively and monitor the GPU via nvidia-smi in a terminal tab - a great development experience. However when you develop directly from a GPU-powered machine, there are times when you may not use the GPU. For example when you write code or browse some documentation. _All that time you pay for a GPU that sits idle_. In that regard, it may not be the most cost-effective option for your use-case.
2. Another option is to use a [**SageMaker Training Job**](https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-training.html) running on a GPU instance. This is a preferred option for training, because training metadata (data and model path, hyperparameters, cluster specification, etc) is persisted in the SageMaker metadata store, logs and metrics stored in Cloudwatch and the instance automatically shuts down itself at the end of training. Developing on a small CPU instance and launching training tasks using SageMaker Training API will help you make the most of your budget, while helping you retain metadata and artifacts of all your experiments. You can see [here a well documented TensorFlow example](https://aws.amazon.com/fr/blogs/machine-learning/using-tensorflow-eager-execution-with-amazon-sagemaker-script-mode/)

### Outstanding Tasks

There are a lot of services in the AWS jungle that we have yet to leverage. If you find something interesting, please notify an admin and add it to this list.

#### Automated model tuning

See [https://aws.amazon.com/blogs/aws/sagemaker-automatic-model-tuning/](https://aws.amazon.com/blogs/aws/sagemaker-automatic-model-tuning/) for how to perform this.

#### Monitoring

See https://docs.aws.amazon.com/sagemaker/latest/dg/training-metrics.html

#### Elastic Inference

Sagemaker claims that training multiple models in parallel can be done more efficiently via EI comput (see [link](https://docs.aws.amazon.com/elastic-inference/latest/developerguide/basics.html)).

#### Sagemaker IDE

The recommended notebook utilisation method is through the Sagemaker IDE. The only drawback to this is that user permissions need to be specified by an admin, and deleting and adding the user seems necessary for instance termination. But this may be incorrect.
